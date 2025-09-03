-- Update chatbot context to remove "cobros garantizados" reference
UPDATE public.chatbot_context 
SET context_data = jsonb_set(
  context_data, 
  '{cobros_garantizados}', 
  '"Gestión profesional de cobros y administración de alquileres"'
)
WHERE topic = 'services' AND context_data ? 'cobros_garantizados';

-- Also update the services data in company_info if needed
UPDATE public.chatbot_context 
SET context_data = jsonb_set(
  context_data,
  '{services}',
  '["gestión integral de alquileres", "selección de inquilinos", "mantenimiento", "gestión legal", "gestión de cobros"]'
)
WHERE topic = 'company_info' AND context_data ? 'services';