// utils/parseResume.js
import { pdf } from 'pdf-js';

export async function parseResume(file) {
  const text = await pdf(file).getTextContent();
  return text.items.map(item => item.str).join(' ');
}