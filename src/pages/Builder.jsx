import { useState, useEffect } from 'react'
// import { useUser } from '@supabase/auth-helpers-react'
import { supabase } from '../supabaseClient'
import Navbar from '../components/Navbar'
import ResumeUploadForm from '../components/ResumeUploadForm'
import ResumeSelector from '../components/ResumeSelector'
import { parseResume } from '../utils/parseResume'
import JobDescriptionAnalysis from '../components/JobDescriptionAnalysis'

export default function Builder() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [resumeText, setResumeText] = useState('');

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


  const [resumes, setResumes] = useState([])

  useEffect(() => {
    const fetchResumes = async () => {
      if (!user) return

      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .eq('user_id', user.id)

      if (!error) setResumes(data)
    }

    fetchResumes()
  }, [user])

  return (
    <>
      {/* <Navbar /> */}
      <main className="container mt-4">
        <h2>Resume Builder</h2>
        {user ? (
          <>
            <ResumeUploadForm userId={user.id} />

            <h2 className="mb-4">Resume Analyzer</h2>

            <ResumeSelector onSelect={(text) => setResumeText(text)} />
            {resumeText && (
              <JobDescriptionAnalysis resumeText={resumeText} />
            )}
          </>
        ) : (
          <div className="alert alert-warning">
            Please login to access the builder
          </div>
        )}
      </main>
    </>
  )
}