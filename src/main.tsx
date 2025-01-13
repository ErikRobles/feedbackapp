import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { FeedbackProvider } from './context/FeedbackContext';
import './index.css';
import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
        <FeedbackProvider>
          <App />
        </FeedbackProvider>
    </StrictMode>,
  );
} else {
  console.error("Root element not found.");
}
