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
  const [authToken, setAuthToken] = useState<string | null>(null);

  useEffect(() => {
    console.log('🔄 FeedbackList re-rendered with feedback:', feedback);
  }, [feedback]);

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
            localStorage.removeItem('authToken');
            setShowPasswordPopup(true);
          }
          throw new Error('Failed to fetch feedback data');
        }

        const data = await response.json();
        setFeedback(data);
      } catch (error) {
        console.error('❌ Error fetching feedback:', error);
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
        headers: { 'Content-Type': 'application/json' },
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
      console.log('🔍 Adding new feedback:', newFeedback); // ✅ Debugging
  
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/feedback`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(newFeedback),
      });
  
      console.log('🔍 Server response status:', response.status); // ✅ Debugging
  
      if (!response.ok) throw new Error('Failed to add feedback');
  
      const data = await response.json();
      console.log('✅ Feedback added from API:', data); // ✅ Debugging
  
      const formattedData: Feedback = {
        id: data.id || data._id, // ✅ Handle MongoDB `_id`
        text: data.text,
        rating: data.rating,
      };
  
      // ✅ Ensure UI updates immediately
      setFeedback((prevFeedback) => [formattedData, ...prevFeedback]);
      console.log('🔄 UI updated with new feedback');
    } catch (error) {
      console.error('❌ Error adding feedback:', error);
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
      console.log('🔍 Updating feedback with ID:', id, 'New data:', updItem);
  
      // ✅ Convert `_id` to `id` before updating state
      const formattedUpdate = {
        id: updItem.id || updItem._id || id,
        text: updItem.text,
        rating: updItem.rating,
      };
  
      // ✅ Optimistically update UI before API call
      setFeedback((prevFeedback) =>
        prevFeedback.map((item) =>
          (item.id || item._id) === id ? { ...item, ...formattedUpdate } : item
        )
      );
  
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/feedback/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`,
        },
        body: JSON.stringify(formattedUpdate),
      });
  
      if (!response.ok) throw new Error('Failed to update feedback');
  
      const data = await response.json();
      console.log('✅ Updated feedback from API:', data);
  
      // ✅ Normalize API response to ensure React detects changes
      setFeedback((prevFeedback) =>
        prevFeedback.map((item) =>
          (item.id || item._id) === (data.id || data._id)
            ? { ...item, ...data, id: data.id || data._id }
            : item
        )
      );
  
      console.log('🔄 UI updated with new feedback');
    } catch (error) {
      console.error('❌ Error updating feedback:', error);
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
  
    try {
      console.log('🗑 Deleting feedback with ID:', id); // ✅ Debugging
  
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/feedback/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${authToken}` },
      });
  
      console.log('🔍 Server response status:', response.status); // ✅ Debugging
  
      if (!response.ok) throw new Error('Failed to delete feedback');
  
      // ✅ Ensure React detects the change
      setFeedback((prevFeedback) => {
        const updatedFeedback = prevFeedback.filter(
          (item) => (item.id || item._id) !== id
        );
        return [...updatedFeedback]; // ✅ Create a new array reference
      });
  
      console.log('✅ Successfully deleted feedback:', id);
    } catch (error) {
      console.error('❌ Error deleting feedback:', error);
    }
  };
  

  /**
   * Set up editing feedback.
   */
  const editFeedback = (item: Feedback): void => {
    console.log('📝 Edit button clicked for:', item);

    setFeedbackEdit({
      item: {
        ...item,
        id: item.id || item._id, // ✅ Ensure id is always set
      },
      edit: true,
    });
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
