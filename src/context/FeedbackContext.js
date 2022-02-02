import { createContext, useState, useEffect } from 'react';
import easyDB from 'easydb-io';
import { v4 as uuidv4 } from 'uuid';

const db = easyDB({
  database: process.env.REACT_APP_EASYDB_DB,
  token: process.env.REACT_APP_EASYDB_TOKEN,
});

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
    // const devEnv = process.env.NODE_ENV !== 'production';
    // const { REACT_APP_DEV_URL, REACT_APP_PROD_URL } = process.env;
    // const response = await fetch(`/feedback?_sort=id&_order=desc`);
    // const response = await fetch(
    //   `${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}?_sort=id&_order=desc`
    // );

    const data = await db.list();

    setFeedback(Object.values.data);
    setIsLoading(false);
  };

  // Add feedback
  const addFeedback = async (newFeedback) => {
    // const devEnv = process.env.NODE_ENV !== 'production';
    // const { REACT_APP_DEV_URL, REACT_APP_PROD_URL } = process.env;
    // const response = await fetch(
    //   `${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}`,
    //   {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(newFeedback),
    //   }
    // );

    // const data = await response.json();

    const id = uuidv4();
    const feedbackToAdd = { ...newFeedback, id };
    await db.put(id, feedbackToAdd);
    setFeedback([feedback, ...feedbackToAdd]);
  };

  // Delete feedback
  const deleteFeedback = async (id) => {
    // const devEnv = process.env.NODE_ENV !== 'production';
    // const { REACT_APP_DEV_URL, REACT_APP_PROD_URL } = process.env;
    if (window.confirm('Are you sure you want to delete?')) {
      await db.delete(id);
      setFeedback(feedback.filter((item) => item.id !== id));
    }
  };

  // Update feedback item
  const updateFeedback = async (id, updItem) => {
    // const devEnv = process.env.NODE_ENV !== 'production';
    // const { REACT_APP_DEV_URL, REACT_APP_PROD_URL } = process.env;
    // const response = await fetch(
    //   `${devEnv ? REACT_APP_DEV_URL : REACT_APP_PROD_URL}/${id}`,
    //   {
    //     method: 'PUT',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(updItem),
    //   }
    // );
    const updatedFeedback = { ...updItem, id };
    await db.put(id, updatedFeedback);

    setFeedback(
      feedback.map((item) => (item.id === id ? updatedFeedback : item))
    );
    setFeedbackEdit({
      item: {},
      edit: false,
    });
  };

  // Forcing git changes for Netlify
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
