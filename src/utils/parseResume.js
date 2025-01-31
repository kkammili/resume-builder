import * as pdfjsLib from 'pdfjs-dist/build/pdf';
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker?url';

// Configure worker
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export const parseResume = async (file) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument(new Uint8Array(arrayBuffer));
    const pdf = await loadingTask.promise;
    
    let fullText = '';
    
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      fullText += textContent.items.map(item => item.str).join(' ') + '\n';
    }
    
    return fullText;
  } catch (error) {
    console.error('PDF Parsing Error:', error);
    throw new Error('Failed to parse PDF resume');
  }
};



