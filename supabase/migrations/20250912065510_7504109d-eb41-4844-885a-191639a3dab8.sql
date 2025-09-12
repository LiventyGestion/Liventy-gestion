-- Fix security linter issues from previous migration

-- Fix function search path issue by updating the log_chatbot_access function
DROP FUNCTION IF EXISTS log_chatbot_access();

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
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;