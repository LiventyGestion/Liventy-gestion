-- Remove "garantizamos cobros" from FAQs and update services context

-- Update FAQs to remove guarantee language
UPDATE public.chatbot_context 
SET context_data = jsonb_set(
  context_data, 
  '{rentabilidad}', 
  '"Optimizamos precios de mercado y gestionamos cobros profesionalmente"'
)
WHERE topic = 'faqs' AND context_data ? 'rentabilidad';

-- Rename the cobros_garantizados key to just cobros in services
UPDATE public.chatbot_context 
SET context_data = (
  context_data - 'cobros_garantizados' || 
  jsonb_build_object('gestion_cobros', 'Gestión profesional de cobros y administración de alquileres')
)
WHERE topic = 'services' AND context_data ? 'cobros_garantizados';