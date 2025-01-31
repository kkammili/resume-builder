// components/ResumeSelector.jsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import {parseResume} from '../utils/parseResume';

export default function ResumeSelector({ onSelect }) {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState(null);

  useEffect(() => {
    const fetchResumes = async () => {
      const { data, error } = await supabase
        .from('resumes')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error) setResumes(data);
      setLoading(false);
    };

    fetchResumes();
  }, []);

  const handleSelect = async (resume) => {
    setSelectedResume(resume.id);
    try {
        let text;
        if (resume.type === 'file') {
               // Construct the correct file path based on the user's ID
               const filePath = resume.file_path; // This should be stored in DB
            const { data, error } = await supabase.storage
                .from('resumes')
                .download(filePath);

            if (error) throw error;
            const file = new Blob([data], { type: 'application/pdf' });
            text = await parseResume(file);
        } else {
            text = [
                resume.content.summary,
                resume.content.experience,
                resume.content.education
            ].join('\n');
        }

        onSelect(text);
    } catch (error) {
        console.error('Error loading resume:', error);
        alert('Failed to load resume content');
    }
};

const cleanFileName = (filePath) => {
    return filePath.replace(/^.+\/\d+_/, ''); 
};


  if (loading) return <div className="spinner-border text-primary"></div>;

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h4>Select a Resume</h4>
        <div className="list-group mt-3">
          {resumes.map((resume) => (
            <button
              key={resume.id}
              onClick={() => handleSelect(resume)}
              className={`list-group-item list-group-item-action ${
                selectedResume === resume.id ? 'active' : ''
              }`}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h5 className="mb-1">
                    {resume.type === 'file' ? cleanFileName(resume.file_path) : 'Manual Resume'}
                  </h5>
                  <small>
                    Uploaded: {new Date(resume.created_at).toLocaleDateString()}
                  </small>
                </div>
                {resume.type === 'file' && (
                  <span className="badge bg-primary rounded-pill">
                    PDF
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
        
        {resumes.length === 0 && (
          <div className="alert alert-info mt-3">
            No resumes found. Upload a resume to get started.
          </div>
        )}
      </div>
    </div>
  );
}