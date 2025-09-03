import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Create test users
    const testUsers = [
      {
        email: 'propietario@ejemplo.com',
        password: 'Prueba1*',
        user_metadata: {
          name: 'Usuario Propietario Demo',
          role: 'propietario'
        }
      },
      {
        email: 'inquilino@ejemplo.com', 
        password: 'Prueba1*',
        user_metadata: {
          name: 'Usuario Inquilino Demo',
          role: 'inquilino'
        }
      }
    ]

    const results = []

    for (const testUser of testUsers) {
      // Check if user already exists
      const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
      const userExists = existingUsers.users?.some(user => user.email === testUser.email)

      if (userExists) {
        console.log(`User ${testUser.email} already exists, skipping creation`)
        results.push({ email: testUser.email, status: 'exists' })
        continue
      }

      // Create user
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: testUser.email,
        password: testUser.password,
        user_metadata: testUser.user_metadata,
        email_confirm: true // Skip email confirmation for demo users
      })

      if (error) {
        console.error(`Error creating user ${testUser.email}:`, error)
        results.push({ email: testUser.email, status: 'error', error: error.message })
      } else {
        console.log(`Created user ${testUser.email}`)
        results.push({ email: testUser.email, status: 'created', id: data.user?.id })
      }
    }

    return new Response(
      JSON.stringify({ 
        message: 'Test users creation completed',
        results 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in create-test-users function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create test users',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})