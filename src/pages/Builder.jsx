import { useState, useEffect } from 'react'
import { useUser } from '@supabase/auth-helpers-react'
import { supabase } from '../supabaseClient'
import Navbar from '../components/Navbar'
import ResumeUploadForm from '../components/ResumeUploadForm'

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

    // Load resume text when resume is selected
    const loadResumeText = async (filePath) => {
        const { data } = await supabase.storage
          .from('resumes')
          .download(filePath);
    
        const text = await parseResume(data);
        setResumeText(text);
      };

  return (
    <>
      {/* <Navbar /> */}
      <main className="container mt-4">
        <h2>Resume Builder</h2>
        {user ? (
          <>
            <ResumeUploadForm userId={user.id} />
            
            <div className="mt-4">
              <h4>Your Saved Resumes</h4>
              {resumes.map(resume => (
                <div key={resume.id} className="card mb-2">
                  <div className="card-body">
                    {resume.type === 'file' ? (
                      <a 
                        href={supabase.storage
                          .from('resumes')
                          .getPublicUrl(resume.file_path).data.publicUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View PDF
                      </a>
                    ) : (
                      <div>
                        <h5>Manual Resume</h5>
                        <p>{resume.content.summary}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
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