import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import {useContext} from 'react'
import Header from './components/Header';
import FeedbackList from './components/FeedbackList';
import FeedbackStats from './components/FeedbackStats';
import FeedbackForm from './components/FeedbackForm';
import AboutPage from './pages/AboutPage';
import { FeedbackProvider } from './context/FeedbackContext';
import AboutIconLink from './components/AboutIconLink';
import PasswordPopup from './components/PasswordPopup';
import FeedbackContext from './context/FeedbackContext';



const App: React.FC = () => {
  const feedbackContext = useContext(FeedbackContext);

  if (!feedbackContext) {
    throw new Error('FeedbackContext must be used within a FeedbackProvider');
  }

  const { showPasswordPopup, verifyPassword, passwordError, setShowPasswordPopup } =
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
                {showPasswordPopup && (
                  <PasswordPopup
                    onSubmit={verifyPassword}
                    onClose={() => setShowPasswordPopup(false)}
                    errorMessage={passwordError}
                  />
                )}
              </>
            }
          />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
        <AboutIconLink />
      </div>
    </Router>
  );
};

export default App;