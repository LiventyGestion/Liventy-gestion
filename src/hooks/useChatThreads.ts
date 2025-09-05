import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

import { Database } from '@/integrations/supabase/types';

export interface ChatMessage {
  id: string;
  thread_id: string;
  sender_user_id?: string;
  sender_role: string;
  text: string;
  attachments?: Database['public']['Tables']['chat_messages']['Row']['attachments'];
  created_at: string;
}

export interface ChatThread {
  id: string;
  user_id: string;
  lease_id?: string;
  property_id?: string;
  status: Database['public']['Tables']['chat_threads']['Row']['status'];
  created_at: string;
  messages?: ChatMessage[];
}

export function useChatThreads() {
  const [threads, setThreads] = useState<ChatThread[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchThreads = async () => {
    try {
      const { data, error } = await supabase
        .from('chat_threads')
        .select(`
          *,
          messages:chat_messages(*)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching chat threads:', error);
        return;
      }

      setThreads((data || []).map(thread => ({
        ...thread,
        messages: thread.messages?.map(msg => ({
          ...msg,
          attachments: Array.isArray(msg.attachments) ? msg.attachments : []
        })) || []
      })));
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const createThread = async (title?: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_threads')
        .insert({
          user_id: (await supabase.auth.getUser()).data.user?.id,
          status: 'abierto'
        })
        .select()
        .single();

      if (error) {
        console.error('Error creating thread:', error);
        toast({
          title: "Error",
          description: "No se pudo crear la consulta.",
          variant: "destructive",
        });
        return null;
      }

      toast({
        title: "Consulta creada",
        description: "Puedes empezar a escribir tu mensaje.",
      });

      await fetchThreads(); // Refresh threads
      return data;
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "Ocurrió un error inesperado.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const sendMessage = async (threadId: string, message: string, attachments?: string[]) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('chat_messages')
        .insert({
          thread_id: threadId,
          sender_user_id: (await supabase.auth.getUser()).data.user?.id,
          sender_role: 'user',
          text: message,
          attachments: attachments || []
        })
        .select()
        .single();

      if (error) {
        console.error('Error sending message:', error);
        toast({
          title: "Error",
          description: "No se pudo enviar el mensaje.",
          variant: "destructive",
        });
        return null;
      }

      // Update thread's updated_at
      await supabase
        .from('chat_threads')
        .update({ status: 'abierto' }) // This will trigger the updated_at timestamp
        .eq('id', threadId);

      await fetchThreads(); // Refresh to get updated messages
      return data;
    } catch (error) {
      console.error('Error:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const updateThreadStatus = async (threadId: string, status: ChatThread['status']) => {
    try {
      const { error } = await supabase
        .from('chat_threads')
        .update({ status })
        .eq('id', threadId);

      if (error) {
        console.error('Error updating thread status:', error);
        return false;
      }

      await fetchThreads(); // Refresh threads
      return true;
    } catch (error) {
      console.error('Error:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  return {
    threads,
    isLoading,
    createThread,
    sendMessage,
    updateThreadStatus,
    fetchThreads
  };
}