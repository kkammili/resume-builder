import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../supabaseClient'

export default function Home() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setLoading(false)
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    checkAuth()

    return () => subscription?.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-12 col-xl-10">
          <div className="card shadow">
            <div className="card-body text-center">
              <h1 className="card-title mb-4">Build Your Professional Resume</h1>
              <p className="lead mb-4">
                Create a standout resume in minutes with our easy-to-use builder
              </p>

              {user ? (
                <div className="mt-4">
                  <h3>Welcome back, {user.email}!</h3>
                  <div className="mt-4">
                    <Link to="/builder" className="btn btn-primary btn-lg">
                      Continue Building
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="mt-4">
                  <h4 className="mb-4">Get Started Now</h4>
                  <Link to="/login" className="btn btn-primary btn-lg">
                    Sign In to Start
                  </Link>
                  <div className="mt-3">
                    <small className="text-muted">
                      No account needed - sign in with Google or GitHub
                    </small>
                  </div>
                </div>
              )}

              <div className="mt-5">
                <h5>Features</h5>
                <div className="row mt-3">
                  <div className="col-md-4">
                    <div className="card mb-3">
                      <div className="card-body">
                        <h6>ATS Friendly</h6>
                        <p className="text-muted small">
                          Optimized for Applicant Tracking Systems
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card mb-3">
                      <div className="card-body">
                        <h6>Professional Templates</h6>
                        <p className="text-muted small">
                          Multiple designs to choose from
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card mb-3">
                      <div className="card-body">
                        <h6>Real-time Preview</h6>
                        <p className="text-muted small">
                          See changes as you build
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}