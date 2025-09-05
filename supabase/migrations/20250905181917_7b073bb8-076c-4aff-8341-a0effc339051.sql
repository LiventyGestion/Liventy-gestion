-- Security Enhancement: Strengthen data validation and add cleanup policies

-- 1. Add email format validation for leads table
CREATE OR REPLACE FUNCTION validate_email_format(email text)
RETURNS boolean AS $$
BEGIN
  RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$ LANGUAGE plpgsql IMMUTABLE;

-- 2. Add rate limiting for leads creation (max 3 leads per email per hour)
CREATE POLICY "Rate limit leads creation"
ON public.leads
FOR INSERT
WITH CHECK (
  (SELECT COUNT(*) 
   FROM public.leads 
   WHERE email = NEW.email 
   AND created_at > NOW() - INTERVAL '1 hour') < 3
);

-- 3. Add email validation constraint for leads
ALTER TABLE public.leads 
ADD CONSTRAINT valid_email_format 
CHECK (validate_email_format(email));

-- 4. Add cleanup policy for anonymous calculator results (auto-delete after 30 days)
CREATE OR REPLACE FUNCTION cleanup_old_anonymous_results()
RETURNS void AS $$
BEGIN
  DELETE FROM public.calculadora_resultados 
  WHERE user_id IS NULL 
  AND created_at < NOW() - INTERVAL '30 days';
END;
$$ LANGUAGE plpgsql;

-- Create a scheduled cleanup (this would need to be run periodically)
-- Users can set up pg_cron extension or run this manually

-- 5. Add rate limiting for calculator results (max 10 calculations per hour for anonymous users)
CREATE POLICY "Rate limit anonymous calculations"
ON public.calculadora_resultados
FOR INSERT
WITH CHECK (
  CASE 
    WHEN user_id IS NULL THEN
      (SELECT COUNT(*) 
       FROM public.calculadora_resultados 
       WHERE user_id IS NULL 
       AND created_at > NOW() - INTERVAL '1 hour'
       AND inputs->>'ip_address' = NEW.inputs->>'ip_address') < 10
    ELSE true
  END
);

-- 6. Add rate limiting for chatbot conversations (max 5 conversations per hour for anonymous)
CREATE POLICY "Rate limit anonymous chatbot conversations"
ON public.chatbot_conversations
FOR INSERT
WITH CHECK (
  CASE 
    WHEN user_id IS NULL THEN
      (SELECT COUNT(*) 
       FROM public.chatbot_conversations 
       WHERE user_id IS NULL 
       AND created_at > NOW() - INTERVAL '1 hour'
       AND session_id LIKE CONCAT(LEFT(NEW.session_id, 10), '%')) < 5
    ELSE true
  END
);

-- 7. Add cleanup for old anonymous chatbot conversations (delete after 7 days)
CREATE OR REPLACE FUNCTION cleanup_old_anonymous_conversations()
RETURNS void AS $$
BEGIN
  -- Delete old anonymous conversations and their messages
  DELETE FROM public.chatbot_messages 
  WHERE conversation_id IN (
    SELECT id FROM public.chatbot_conversations 
    WHERE user_id IS NULL 
    AND created_at < NOW() - INTERVAL '7 days'
  );
  
  DELETE FROM public.chatbot_conversations 
  WHERE user_id IS NULL 
  AND created_at < NOW() - INTERVAL '7 days';
END;
$$ LANGUAGE plpgsql;