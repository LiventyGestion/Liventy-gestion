-- Fix critical security vulnerability in chatbot conversation access
-- The issue: Anonymous users can access all anonymous conversations because 
-- validate_chatbot_session_access only checks session format, not ownership

-- Drop the problematic policies
DROP POLICY IF EXISTS "chatbot_conversations_secure_select_v3" ON public.chatbot_conversations;
DROP POLICY IF EXISTS "chatbot_messages_secure_select_v3" ON public.chatbot_messages;

-- Create a secure session validation function that requires proper session matching
CREATE OR REPLACE FUNCTION public.validate_anonymous_session_access(p_session_id text, p_conversation_session_id text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $function$
BEGIN
    -- Anonymous users can only access conversations with their exact session_id
    IF p_session_id IS NULL OR p_conversation_session_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Validate session format
    IF length(p_session_id) < 10 OR length(p_session_id) > 100 OR
       length(p_conversation_session_id) < 10 OR length(p_conversation_session_id) > 100 THEN
        RETURN FALSE;
    END IF;
    
    -- Sessions must match exactly
    RETURN p_session_id = p_conversation_session_id;
END;
$function$;

-- Create new secure SELECT policy for chatbot_conversations
-- Anonymous users can NO LONGER access conversations through RLS alone
-- They must use application-level filtering with their specific session_id
CREATE POLICY "chatbot_conversations_secure_select_v4" 
ON public.chatbot_conversations 
FOR SELECT 
USING (
  -- Authenticated users can see their own conversations
  (auth.uid() IS NOT NULL AND user_id = auth.uid()) OR
  -- Admins can see all conversations
  (EXISTS ( 
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )) OR
  -- Service role access
  (auth.role() = 'service_role')
  -- NOTE: Anonymous access is REMOVED from RLS policy
  -- Anonymous users must use application-level session filtering
);

-- Create new secure SELECT policy for chatbot_messages
CREATE POLICY "chatbot_messages_secure_select_v4" 
ON public.chatbot_messages 
FOR SELECT 
USING (
  EXISTS ( 
    SELECT 1 
    FROM chatbot_conversations c
    WHERE c.id = chatbot_messages.conversation_id 
    AND (
      -- Authenticated users can see messages from their own conversations
      (auth.uid() IS NOT NULL AND c.user_id = auth.uid()) OR
      -- Admins can see all messages
      (EXISTS ( 
        SELECT 1 FROM profiles p
        WHERE p.id = auth.uid() AND p.role = 'admin'
      )) OR
      -- Service role access
      (auth.role() = 'service_role')
      -- NOTE: Anonymous access is REMOVED from RLS policy
    )
  )
);

-- Log security fix
SELECT log_security_event(
  'chatbot_anonymous_access_vulnerability_fixed',
  NULL,
  NULL,
  NULL,
  jsonb_build_object(
    'vulnerability', 'Anonymous users could access all chatbot conversations',
    'fix', 'Removed anonymous access from RLS policies, requires application-level session filtering',
    'policies_updated', ARRAY['chatbot_conversations_secure_select_v4', 'chatbot_messages_secure_select_v4'],
    'timestamp', NOW()
  ),
  'critical'
);