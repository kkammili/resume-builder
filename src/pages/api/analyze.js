// pages/api/analyze.js
import { HuggingFaceInference } from '@huggingface/inference';

const hf = new HuggingFaceInference(process.env.HF_TOKEN);

export default async function handler(req, res) {
  const { resume, jd } = req.body;

  try {
    // 1. Skill Matching
    const skillsResponse = await hf.featureExtraction({
      inputs: {
        source_sentence: jd,
        sentences: [resume]
      },
      model: 'sentence-transformers/all-MiniLM-L6-v2'
    });

    // 2. Keyword Extraction
    const keywords = await hf.tokenClassification({
      inputs: jd,
      model: 'yanekyuk/bert-keyword-extractor'
    });

    // 3. Generate Suggestions
    const suggestions = await hf.textGeneration({
      inputs: `Improve this resume for the job description:\nResume: ${resume}\nJob: ${jd}`,
      parameters: { max_length: 500 }
    });

    // Calculate match score
    const matchScore = Math.round(skillsResponse[0] * 100);

    // Process results
    const result = {
      matchScore,
      missingSkills: keywords.filter(k => !resume.includes(k.word)),
      suggestions: suggestions.generated_text
    };

    res.status(200).json(result);
    
  } catch (error) {
    res.status(500).json({ error: 'Analysis failed' });
  }
}