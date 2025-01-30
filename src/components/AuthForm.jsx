// Corrected imports
import { Auth } from "@supabase/auth-ui-react"
import { supabase } from "../supabaseClient"
import { ThemeSupa } from "@supabase/auth-ui-shared" // Fixed typo in ThemeSupa

const AuthForm = () => (
    <Auth
      supabaseClient={supabase}
      appearance={{ 
        theme: ThemeSupa,
        variables: {
          default: {
            colors: {
              brand: '#6366f1',    // Customize colors
              brandAccent: '#4338ca'
            },
            space: {
              inputPadding: '1rem' // Increase input padding
            },
            widths: {
              inputWidth: '100%'   // Full-width inputs
            }
          }
        }
      }}
      providers={['google', 'github']}
    />
  )

export default AuthForm