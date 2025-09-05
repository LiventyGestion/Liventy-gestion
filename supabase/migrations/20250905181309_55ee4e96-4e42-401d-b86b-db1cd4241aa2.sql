-- Fix critical security vulnerability: Remove public access to chatbot data

-- 1. Drop existing overly permissive policies for chatbot_conversations
DROP POLICY IF EXISTS "Anyone can create conversations" ON public.chatbot_conversations;
DROP POLICY IF EXISTS "Users can update their own conversations" ON public.chatbot_conversations;
DROP POLICY IF EXISTS "Users can view their own conversations" ON public.chatbot_conversations;

-- 2. Drop existing overly permissive policies for chatbot_messages  
DROP POLICY IF EXISTS "Anyone can create messages" ON public.chatbot_messages;
DROP POLICY IF EXISTS "Users can view messages from their conversations" ON public.chatbot_messages;

-- 3. Drop existing overly permissive policies for chatbot_context
DROP POLICY IF EXISTS "Everyone can read context" ON public.chatbot_context;
DROP POLICY IF EXISTS "Only authenticated users can create context" ON public.chatbot_context;
DROP POLICY IF EXISTS "Only authenticated users can update context" ON public.chatbot_context;

-- 4. Create secure policies for chatbot_conversations
-- Allow authenticated users to create conversations
CREATE POLICY "Authenticated users can create conversations"
ON public.chatbot_conversations
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);

-- Allow users to view only their own conversations (no anonymous access)
CREATE POLICY "Users can view own conversations"
ON public.chatbot_conversations
FOR SELECT
TO authenticated
USING (user_id = auth.uid());

-- Allow users to update only their own conversations
CREATE POLICY "Users can update own conversations"
ON public.chatbot_conversations
FOR UPDATE
TO authenticated
USING (user_id = auth.uid());

-- 5. Create secure policies for chatbot_messages
-- Allow authenticated users to create messages for their conversations
CREATE POLICY "Users can create messages for own conversations"
ON public.chatbot_messages
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.chatbot_conversations 
    WHERE id = chatbot_messages.conversation_id 
    AND user_id = auth.uid()
  )
);

-- Allow users to view messages only from their own conversations
CREATE POLICY "Users can view own conversation messages"
ON public.chatbot_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.chatbot_conversations 
    WHERE id = chatbot_messages.conversation_id 
    AND user_id = auth.uid()
  )
);

-- 6. Create secure policies for chatbot_context (business intelligence)
-- Only admin users can read business context
CREATE POLICY "Only admins can read context"
ON public.chatbot_context
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Only admin users can create context
CREATE POLICY "Only admins can create context"
ON public.chatbot_context
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Only admin users can update context
CREATE POLICY "Only admins can update context"
ON public.chatbot_context
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- 7. Add policy for anonymous chatbot usage (service role only)
-- Allow the chatbot edge function (using service role) to create conversations for anonymous users
CREATE POLICY "Service role can create anonymous conversations"
ON public.chatbot_conversations
FOR INSERT
TO service_role
WITH CHECK (true);

-- Allow service role to create messages for any conversation
CREATE POLICY "Service role can create messages"
ON public.chatbot_messages
FOR INSERT
TO service_role
WITH CHECK (true);

-- Allow service role to read context for chatbot functionality
CREATE POLICY "Service role can read context"
ON public.chatbot_context
FOR SELECT
TO service_role
USING (true);