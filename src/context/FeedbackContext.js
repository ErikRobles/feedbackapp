import { createContext, useState, useEffect } from 'react';

const FeedbackContext = createContext();

export const FeedbackProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [feedback, setFeedback] = useState([]);
  const [feedbackEdit, setFeedbackEdit] = useState({
    item: {},
    edit: false,
  });

  useEffect(() => {
    fetchFeedback();
  }, []);

  // Fetch feedback
  const fetchFeedback = async () => {
    const devEnv = process.env.NODE_ENV !== 'production';
    const { REACT_APP_DEV_URL, REACT_APP_PROD_URL } = process.env;
    // const response = await fetch(`/feedback?_sort=id&_order=desc`);
    const response = await fetch(
      `${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}?_sort=id&_order=desc`
    );

    const data = await response.json();

    setFeedback(data);
    setIsLoading(false);
  };

  // Add feedback
  const addFeedback = async (newFeedback) => {
    const devEnv = process.env.NODE_ENV !== 'production';
    const { REACT_APP_DEV_URL, REACT_APP_PROD_URL } = process.env;
    const response = await fetch(
      `${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newFeedback),
      }
    );

    const data = await response.json();

    setFeedback([data, ...feedback]);
  };

  // Delete feedback
  const deleteFeedback = async (id) => {
    const devEnv = process.env.NODE_ENV !== 'production';
    const { REACT_APP_DEV_URL, REACT_APP_PROD_URL } = process.env;
    if (window.confirm('Are you sure you want to delete?')) {
      await fetch(`${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/${id}`, {
        method: 'DELETE',
      });

      setFeedback(feedback.filter((item) => item.id !== id));
    }
  };

  // Update feedback item
  const updateFeedback = async (id, updItem) => {
    const devEnv = process.env.NODE_ENV !== 'production';
    const { REACT_APP_DEV_URL, REACT_APP_PROD_URL } = process.env;
    const response = await fetch(
      `${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/${id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updItem),
      }
    );

    const data = await response.json();

    setFeedback(
      feedback.map((item) => (item.id === id ? { ...item, ...data } : item))
    );
  };

  // Set item to be updated
  const editFeedback = (item) => {
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
        isLoading,
        deleteFeedback,
        addFeedback,
        editFeedback,
        updateFeedback,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

export default FeedbackContext;
