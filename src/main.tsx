
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Preload profile images for competitors
const competitor1Image = "/lovable-uploads/1ae02e55-7319-4db9-b53d-d5b281651d25.png";
const competitor2Image = "/lovable-uploads/9e014a92-5754-4395-82a1-70383e5dc717.png";

createRoot(document.getElementById("root")!).render(<App />);
