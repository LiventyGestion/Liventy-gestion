-- Fix chatbot conversations security policies to properly handle anonymous access

-- Drop existing problematic policies
DROP POLICY IF EXISTS "chatbot_conversations_secure_select_v2" ON public.chatbot_conversations;
DROP POLICY IF EXISTS "chatbot_messages_secure_select_v2" ON public.chatbot_messages;

-- Create secure SELECT policy for chatbot_conversations
-- Users can only see:
-- 1. Their own authenticated conversations (user_id = auth.uid())
-- 2. Anonymous conversations with their session_id (for anonymous users only)
-- 3. Admins can see all conversations
CREATE POLICY "chatbot_conversations_secure_select_v3" 
ON public.chatbot_conversations 
FOR SELECT 
USING (
  -- Authenticated users can see their own conversations
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  -- Anonymous users can only see anonymous conversations through session validation
  (auth.uid() IS NULL AND user_id IS NULL AND validate_chatbot_session_access(session_id) = true) OR
  -- Admins can see all conversations
  (EXISTS ( 
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )) OR
  -- Service role access
  (auth.role() = 'service_role')
);

-- Create secure SELECT policy for chatbot_messages
-- Messages can only be accessed if the user has access to the parent conversation
CREATE POLICY "chatbot_messages_secure_select_v3" 
ON public.chatbot_messages 
FOR SELECT 
USING (
  EXISTS ( 
    SELECT 1 
    FROM chatbot_conversations c
    WHERE c.id = chatbot_messages.conversation_id 
    AND (
      -- Authenticated users can see their own conversations
      (auth.uid() IS NOT NULL AND c.user_id = auth.uid()) OR
      -- Anonymous users can only see anonymous conversations with valid session
      (auth.uid() IS NULL AND c.user_id IS NULL AND validate_chatbot_session_access(c.session_id) = true) OR
      -- Admins can see all conversations
      (EXISTS ( 
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid() AND p.role = 'admin'
      )) OR
      -- Service role access
      (auth.role() = 'service_role')
    )
  )
);

-- Log security policy update
SELECT log_security_event(
  'chatbot_security_policies_updated',
  NULL,
  NULL,
  NULL,
  jsonb_build_object(
    'updated_policies', ARRAY['chatbot_conversations_secure_select_v3', 'chatbot_messages_secure_select_v3'],
    'security_improvement', 'Fixed anonymous conversation access control',
    'timestamp', NOW()
  ),
  'medium'
);