import React, { createContext, useState, ReactNode } from 'react';
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

  // Function to delete feedback
  const deleteFeedback = (id: string): void => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      setFeedback(feedback.filter((item) => item.id !== id));
    }
  };
  
  // Function to add feedback
  const addFeedback = (newFeedback: Feedback): void => {
    newFeedback.id = uuidv4(); // Ensure `id` is a number
    setFeedback([newFeedback, ...feedback]);
  };

  // Function to update feedback
  const updateFeedback = (id: string | number, updItem: Feedback): void => {
    setFeedback(feedback.map((item) => (item.id === id ? { ...updItem } : item)));
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
