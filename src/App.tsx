import React, { useContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Header from './components/Header';
import FeedbackList from './components/FeedbackList';
import FeedbackStats from './components/FeedbackStats';
import FeedbackForm from './components/FeedbackForm';
import AboutPage from './pages/AboutPage';
import AboutIconLink from './components/AboutIconLink';
import PasswordPopup from './components/PasswordPopup';
import FeedbackContext from './context/FeedbackContext';

const App: React.FC = () => {
  const feedbackContext = useContext(FeedbackContext);

  if (!feedbackContext) {
    throw new Error('FeedbackContext must be used within a FeedbackProvider');
  }

  const { showPasswordPopup, setShowPasswordPopup, verifyPassword, passwordError } =
    feedbackContext;

  return (
    <Router>
      <Header />
      <div className="container">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <FeedbackForm />
                <FeedbackStats />
                <FeedbackList />
              </>
            }
          />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <AboutIconLink />
      </div>
      {showPasswordPopup && (
        <PasswordPopup
          onSubmit={verifyPassword}
          onClose={() => setShowPasswordPopup(false)}
          errorMessage={passwordError}
        />
      )}
    </Router>
  );
};

export default App;
