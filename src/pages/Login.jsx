import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabaseClient'
import AuthForm from '../components/AuthForm'

export default function Login() {
    const navigate = useNavigate()

    useEffect(() => {
        const { data: authListener } = supabase.auth.onAuthStateChange(
            (event, session) => {
                if (session?.user) navigate('/')
            }
        )

        return () => authListener?.subscription?.unsubscribe()
    }, [navigate])

    return (
        <div className='container-fluid mt-5'>
            <div className="row justify-content-center mt-5">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card">
                        <div className="card-body p-5">
                            <AuthForm />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}