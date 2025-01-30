import { useState, useEffect } from 'react'
import { supabase } from '../supabaseClient'

export default function ResumeUploadForm({ userId }) {
    const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)
  const [file, setFile] = useState(null)
  const [manualData, setManualData] = useState({
    summary: '',
    experience: '',
    education: '',
    skills: ''
  })
  const [activeTab, setActiveTab] = useState('upload')
  //set user
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

  // Handle file upload
  const handleFileUpload = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
        if (!user) throw new Error("User not authenticated");

        // Add user ID to file path
        const filePath = `${user.id}/${Date.now()}_${file.name}`;
      
        const { data, error } = await supabase.storage
          .from('resumes')
          .upload(filePath, file, {
            cacheControl: '3600',
            contentType: file.type
          });
      
        if (error) throw error;
      
        // Database insert with user_id check
        const { error: dbError } = await supabase
          .from('resumes')
          .insert({
            user_id: user.id, // Must match auth.uid()
            file_path: filePath,
            type: 'file'
          });
      
        if (dbError) throw dbError;
      alert('Resume uploaded successfully!')
      
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  // Handle manual input
  const handleManualSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await supabase
        .from('resumes')
        .insert([{
          user_id: userId,
          content: manualData,
          type: 'manual'
        }])

      if (error) throw error
      alert('Resume saved successfully!')
      
    } catch (error) {
      alert(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card mt-4">
      <div className="card-body">
        <ul className="nav nav-tabs">
          <li className="nav-item">
            <button 
              className={`nav-link ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              Upload PDF
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === 'manual' ? 'active' : ''}`}
              onClick={() => setActiveTab('manual')}
            >
              Manual Input
            </button>
          </li>
        </ul>

        {activeTab === 'upload' ? (
          <form onSubmit={handleFileUpload} className="mt-3">
            <div className="mb-3">
              <label className="form-label">Upload Resume (PDF)</label>
              <input 
                type="file" 
                className="form-control"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files[0])}
                required
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Uploading...' : 'Upload Resume'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleManualSubmit} className="mt-3">
            <div className="mb-3">
              <label className="form-label">Professional Summary</label>
              <textarea
                className="form-control"
                value={manualData.summary}
                onChange={(e) => setManualData({...manualData, summary: e.target.value})}
                required
              />
            </div>
            
            <div className="mb-3">
              <label className="form-label">Work Experience</label>
              <textarea
                className="form-control"
                value={manualData.experience}
                onChange={(e) => setManualData({...manualData, experience: e.target.value})}
                required
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Resume'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}