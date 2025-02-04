import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { Feedback } from '../types/feedbackTypes';

interface FeedbackEdit {
  item: Feedback | {};
  edit: boolean;
}

interface FeedbackContextType {
  feedback: Feedback[];
  feedbackEdit: FeedbackEdit;
  deleteFeedback: (id: string) => Promise<void>;
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
  const [authToken, setAuthToken] = useState<string | null>(null); // Stores the JWT

  /**
   * Restore token from localStorage on page refresh.
   */
  useEffect(() => {
    const existingToken = localStorage.getItem('authToken');
    if (existingToken) {
      setAuthToken(existingToken);
      setPasswordVerified(true);
    }
  }, []);

  /**
   * Fetch feedback from the backend.
   */
  useEffect(() => {
    const fetchFeedback = async () => {
      if (!authToken) {
        setShowPasswordPopup(true);
        return;
      }
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/feedback`, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setAuthToken(null);
            setPasswordVerified(false);
            localStorage.removeItem('authToken');
            setShowPasswordPopup(true);
          }
          throw new Error('Failed to fetch feedback data');
        }

        const data = await response.json();

        // ✅ Ensure each item has `id` instead of `_id`
        const formattedData = data.map((item: any) => ({
          ...item,
          id: item._id, // Map MongoDB _id to id
        }));

        setFeedback(formattedData);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };

    fetchFeedback();
  }, [authToken]);

  /**
   * Verify password and get JWT token.
   */
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

      const data: { token: string } = await response.json();
      setAuthToken(data.token);
      localStorage.setItem('authToken', data.token);
      setPasswordVerified(true);
      setShowPasswordPopup(false);
      setPasswordError(null);
    } catch (error) {
      setPasswordVerified(false);
      setPasswordError('Invalid password. Please try again.');
    }
  };

  /**
   * Create new feedback.
   */
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
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(newFeedback),
      });

      if (!response.ok) throw new Error('Failed to add feedback');

      const data: Feedback = await response.json();
      
      // ✅ Ensure the new feedback item has an `id`
      const formattedData = { ...data, id: data._id };
      setFeedback((prevFeedback) => [formattedData, ...prevFeedback]);
    } catch (error) {
      console.error('Error adding feedback:', error);
    }
  };

  /**
   * Update existing feedback.
   */
  const updateFeedback = async (id: string, updItem: Feedback): Promise<void> => {
    if (!authToken) {
      setShowPasswordPopup(true);
      return;
    }

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/feedback/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(updItem),
      });

      if (!response.ok) throw new Error('Failed to update feedback');

      const data = await response.json();
      const formattedData = { ...data, id: data._id }; // ✅ Ensure consistent `id`

      setFeedback((items) => items.map((item) => (item.id === id ? formattedData : item)));
    } catch (error) {
      console.error('Error updating feedback:', error);
    }
  };

  /**
   * Delete feedback by ID.
   */
  const deleteFeedback = async (id: string): Promise<void> => {
    if (!authToken) {
      setShowPasswordPopup(true);
      return;
    }

    console.log('Deleting feedback with ID:', id);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/feedback/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (!response.ok) throw new Error('Failed to delete feedback');

      setFeedback((items) => items.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };

  /**
   * Set up editing feedback.
   */
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
