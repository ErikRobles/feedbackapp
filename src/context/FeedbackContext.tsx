import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Feedback } from '../types/feedbackTypes';

interface FeedbackEdit {
  item: Feedback | {};
  edit: boolean;
}

interface FeedbackContextType {
  feedback: Feedback[];
  feedbackEdit: FeedbackEdit;
  deleteFeedback: (id: string) => void;
  addFeedback: (newFeedback: Feedback) => Promise<void>;
  updateFeedback: (id: string, updItem: Feedback) => Promise<void>;
  editFeedback: (item: Feedback) => void;
  passwordVerified: boolean;
  authToken: string | null;
  showPasswordPopup: boolean;
  passwordError: string | null;
  verifyPassword: (password: string) => void;
  setShowPasswordPopup: (value: boolean) => void;
}

export const FeedbackContext = createContext<FeedbackContextType | null>(null);

interface FeedbackProviderProps {
  children: ReactNode;
}

export const FeedbackProvider: React.FC<FeedbackProviderProps> = ({ children }) => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [feedbackEdit, setFeedbackEdit] = useState<FeedbackEdit>({ item: {}, edit: false });
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [authToken, setAuthToken] = useState<string | null>(null); // State to store the token


  useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/feedback`);
        if (!response.ok) throw new Error('Failed to fetch feedback data');
        const data = await response.json();
        setFeedback(data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };

    fetchFeedback();
  }, []);

  const requirePassword = () => {
    setShowPasswordPopup(true);
  };

  
  const deleteFeedback = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/feedback/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete feedback');
      setFeedback(feedback.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  const addFeedback = async (newFeedback: Feedback): Promise<void> => {
    if (!authToken) {
      setShowPasswordPopup(true);
      return;
    }
  
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "Authorization": `Bearer ${authToken}`,
        },
        body: JSON.stringify(newFeedback),
      });
  
      if (!response.ok) throw new Error('Failed to add feedback');
  
      const data: Feedback = await response.json();
      setFeedback((prevFeedback) => [data, ...prevFeedback]);
    } catch (error) {
      console.error('Error adding feedback:', error);
    }
  };
  
  
  const verifyPassword = async (password: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/feedback/verify-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ password }),
      });
  
      if (!response.ok) throw new Error('Invalid password');
  
      // Parse the JSON response
      const data: { token: string } = await response.json(); // Ensure the token is typed
      setAuthToken(data.token); // Now `data.token` will be accessible
      setPasswordVerified(true);
      setShowPasswordPopup(false);
      setPasswordError(null);
    } catch (error) {
      setPasswordError('Invalid password. Please try again.');
    }
  };
  

  const updateFeedback = async (id: string, updItem: Feedback): Promise<void> => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/feedback/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updItem),
      });
      if (!response.ok) throw new Error('Failed to update feedback');
      const data = await response.json();
      setFeedback(feedback.map((item) => (item.id === id ? data : item)));
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  const editFeedback = (item: Feedback): void => {
    setFeedbackEdit({ item, edit: true });
  };

  return (
    <FeedbackContext.Provider
      value={{
        feedback,
        feedbackEdit,
        deleteFeedback,
        addFeedback,
        updateFeedback,
        editFeedback,
        passwordVerified,
        authToken,
        showPasswordPopup,
        passwordError,
        verifyPassword,
        setShowPasswordPopup,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export default FeedbackContext;
