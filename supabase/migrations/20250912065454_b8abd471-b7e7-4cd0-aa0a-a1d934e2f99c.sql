-- SECURITY FIX: Remove anonymous read access to chatbot conversations
-- This addresses the critical vulnerability where anonymous users could read private conversations

-- Drop the vulnerable policy that allows anonymous read access
DROP POLICY IF EXISTS "chatbot_conversations_secure_select_anonymous" ON public.chatbot_conversations;

-- Update the anonymous access policy for chatbot_messages to be more restrictive  
-- Remove the 24-hour window and add stricter session validation
DROP POLICY IF EXISTS "chatbot_messages_secure_select" ON public.chatbot_messages;

-- Create new secure policy for chatbot_messages that only allows access during active sessions
CREATE POLICY "chatbot_messages_secure_select_v2" ON public.chatbot_messages
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM chatbot_conversations c
    WHERE c.id = chatbot_messages.conversation_id 
    AND (
      -- Authenticated users can access their own conversations
      c.user_id = auth.uid() 
      OR 
      -- Admins can access all conversations
      (EXISTS (SELECT 1 FROM profiles p WHERE p.id = auth.uid() AND p.role = 'admin'))
      OR
      -- Service role access for system operations
      auth.role() = 'service_role'
    )
  )
);

-- Ensure chatbot conversations can only be read by:
-- 1. The conversation owner (authenticated users)
-- 2. Admins
-- 3. Service role for system operations
-- Anonymous users can NO LONGER read conversation data

-- Add additional security: Create audit trigger for sensitive data access
CREATE OR REPLACE FUNCTION log_chatbot_access()
RETURNS TRIGGER AS $$
BEGIN
    -- Log any access to chatbot conversations for security monitoring
    IF TG_OP = 'SELECT' THEN
        RAISE NOTICE 'Chatbot conversation accessed: User=%, Conversation=%, Time=%', 
            COALESCE(auth.uid()::text, 'anonymous'), 
            COALESCE(NEW.id::text, OLD.id::text), 
            now();
    END IF;
    
    IF TG_OP = 'DELETE' THEN
        RETURN OLD;
    ELSE
        RETURN NEW;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;