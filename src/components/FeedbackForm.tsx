import { useState, useContext, useEffect, ChangeEvent, FormEvent } from 'react';
import React from 'react';
import Card from './shared/Card';
import Button from './shared/Button';
import RatingSelect from './RatingSelect';
import FeedbackContext from '../context/FeedbackContext';
import { Feedback } from '../types/feedbackTypes';
import PasswordPopup from './PasswordPopup'; // Import your popup component

const FeedbackForm: React.FC = () => {
  const [text, setText] = useState<string>('');
  const [btnDisabled, setBtnDisabled] = useState<boolean>(true);
  const [rating, setRating] = useState<number>(10);
  const [message, setMessage] = useState<string | null>(null);
  const [pendingFeedback, setPendingFeedback] = useState<Feedback | null>(null); // Store pending feedback

  const feedbackContext = useContext(FeedbackContext);

  if (!feedbackContext) {
    throw new Error('FeedbackContext must be used within a FeedbackProvider');
  }

  const {
    addFeedback,
    feedbackEdit,
    updateFeedback,
    showPasswordPopup,
    verifyPassword,
    passwordError,
    setShowPasswordPopup,
  } = feedbackContext;

  useEffect(() => {
    if (feedbackEdit.edit === true && isFeedback(feedbackEdit.item)) {
      setBtnDisabled(false);
      setText(feedbackEdit.item.text);
      setRating(feedbackEdit.item.rating);
    }
  }, [feedbackEdit]);

  useEffect(() => {
    if (!showPasswordPopup && pendingFeedback) {
      // Retry form submission after popup is closed
      addFeedback(pendingFeedback);
      setPendingFeedback(null); // Clear pending feedback
    }
  }, [showPasswordPopup, pendingFeedback, addFeedback]);

  const handleTextChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    if (input === '') {
      setBtnDisabled(true);
      setMessage(null);
    } else if (input.trim().length <= 10) {
      setMessage('Message must be more than 10 characters.');
      setBtnDisabled(true);
    } else {
      setBtnDisabled(false);
      setMessage(null);
    }
    setText(input);
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (text.trim().length > 10) {
      const newFeedback: Feedback = {
        id: crypto.randomUUID(), // Generates a string ID
        text,
        rating,
      };

      if (feedbackEdit.edit === true && isFeedback(feedbackEdit.item)) {
        updateFeedback(feedbackEdit.item.id, newFeedback);
      } else {
        setPendingFeedback(newFeedback); // Store feedback temporarily
        setShowPasswordPopup(true); // Trigger the password popup
      }

      setText('');
    }
  };

  const handleClosePopup = () => {
    setShowPasswordPopup(false);
  };

  return (
    <>
      <Card>
        <form onSubmit={handleSubmit}>
          <h2>How would you rate your service with us?</h2>
          <RatingSelect select={(rating: number) => setRating(rating)} />
          <div className="input-group">
            <input
              onChange={handleTextChange}
              type="text"
              placeholder="Write a review"
              value={text}
            />
            <Button type="submit" isDisabled={btnDisabled}>
              Send
            </Button>
          </div>
          {message && <div className="message">{message}</div>}
        </form>
      </Card>
      {showPasswordPopup && (
        <PasswordPopup
          onSubmit={verifyPassword}
          onClose={handleClosePopup}
          passwordError={passwordError}
        />
      )}
    </>
  );
};

// Type guard to narrow `feedbackEdit.item` to type `Feedback`
const isFeedback = (item: unknown): item is Feedback => {
  return (
    typeof item === 'object' &&
    item !== null &&
    'id' in item &&
    (typeof (item as Feedback).id === 'string' || typeof (item as Feedback).id === 'number') &&
    'text' in item &&
    'rating' in item
  );
};

export default FeedbackForm;
