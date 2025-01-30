// components/JobDescriptionAnalysis.jsx
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function JobDescriptionAnalysis({ resumeText }) {
  const [jd, setJd] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);

  const analyzeJD = async () => {
    setLoading(true);
    try {
      // Save JD to database
      const { data, error } = await supabase
        .from('job_descriptions')
        .insert([{
          content: jd,
          user_id: (await supabase.auth.getUser()).data.user.id
        }]);

      // Get AI analysis
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resume: resumeText, jd })
      });

      const results = await response.json();
      setAnalysis(results);
      
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card mt-4">
      <div className="card-body">
        <h4>Job Description Analysis</h4>
        <textarea
          className="form-control mt-3"
          rows="6"
          placeholder="Paste job description here..."
          value={jd}
          onChange={(e) => setJd(e.target.value)}
        />
        
        <button 
          className="btn btn-primary mt-3"
          onClick={analyzeJD}
          disabled={loading || !jd}
        >
          {loading ? 'Analyzing...' : 'Analyze & Improve Resume'}
        </button>

        {analysis && (
          <div className="mt-4">
            <h5>Analysis Results</h5>
            <div className="alert alert-success">
              <strong>Match Score:</strong> {analysis.matchScore}%
            </div>
            <div className="card mt-2">
              <div className="card-body">
                <h6>Missing Skills:</h6>
                <ul>
                  {analysis.missingSkills.map((skill, i) => (
                    <li key={i}>{skill}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="card mt-2">
              <div className="card-body">
                <h6>Suggested Improvements:</h6>
                <p>{analysis.suggestions}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}