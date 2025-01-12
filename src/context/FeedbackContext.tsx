import React, { createContext, useState, ReactNode, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Feedback } from '../types/feedbackTypes';

// Define the FeedbackEdit type
interface FeedbackEdit {
  item: Feedback | {};
  edit: boolean;
}

// Define the context type
interface FeedbackContextType {
  feedback: Feedback[];
  feedbackEdit: FeedbackEdit;
  deleteFeedback: (id: string) => void;
  addFeedback: (newFeedback: Feedback) => void;
  updateFeedback: (id: string, updItem: Feedback) => void;
  editFeedback: (item: Feedback) => void;
}

// Initialize the context with null (before the provider sets the value)
export const FeedbackContext = createContext<FeedbackContextType | null>(null);

// Props type for the FeedbackProvider
interface FeedbackProviderProps {
  children: ReactNode;
}

export const FeedbackProvider: React.FC<FeedbackProviderProps> = ({ children }) => {
  const [feedback, setFeedback] = useState<Feedback[]>([]);
  const [feedbackEdit, setFeedbackEdit] = useState<FeedbackEdit>({
    item: {},
    edit: false,
  });

   // Fetch feedback data from the backend
   useEffect(() => {
    const fetchFeedback = async () => {
      try {
        const response = await fetch('https://feedback-api-1gs7.onrender.com/feedback'); // Replace with backend URL
        if (!response.ok) throw new Error('Failed to fetch feedback data');
        const data = await response.json();
        setFeedback(data);
      } catch (error) {
        console.error('Error fetching feedback:', error);
      }
    };

    fetchFeedback();
  }, []);

  // Function to delete feedback
  const deleteFeedback = async (id: string): Promise<void> => {
    try {
      const response = await fetch(`https://feedback-api-1gs7.onrender.com/feedback/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete feedback');
      setFeedback(feedback.filter((item) => item.id !== id));
    } catch (error) {
      console.error('Error deleting feedback:', error);
    }
  };
  
  // Function to add feedback
  const addFeedback = async (newFeedback: Feedback): Promise<void> => {
    try {
      const response = await fetch('https://feedback-api-1gs7.onrender.com/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFeedback),
      });
      if (!response.ok) throw new Error('Failed to add feedback');
      const data = await response.json();
      setFeedback([data, ...feedback]);
    } catch (error) {
      console.error('Error adding feedback:', error);
    }
  };

  // Function to update feedback
  const updateFeedback = async (id: string, updItem: Feedback): Promise<void> => {
    try {
      const response = await fetch(`https://feedback-api-1gs7.onrender.com/feedback/${id}`, {
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
  

  // Function to edit feedback
  const editFeedback = (item: Feedback): void => {
    setFeedbackEdit({
      item,
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
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export default FeedbackContext;
