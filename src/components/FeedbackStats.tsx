import { useContext } from 'react';
import FeedbackContext from '../context/FeedbackContext';
import { Feedback } from '../types/feedbackTypes';

const FeedbackStats: React.FC = () => {
  const feedbackContext = useContext(FeedbackContext);

  if (!feedbackContext) {
    throw new Error('FeedbackContext must be used within a FeedbackProvider');
  }

  const { feedback } = feedbackContext;

  // Calculate ratings average
  const average =
    feedback.length > 0
      ? (
          feedback.reduce((acc: number, cur: Feedback) => acc + cur.rating, 0) /
          feedback.length
        )
          .toFixed(1)
          .replace(/[.,]0$/, '')
      : '0';

  return (
    <div className="feedback-stats">
      <h4>{feedback.length} Reviews</h4>
      <h4>Average Rating: {average}</h4>
    </div>
  );
};

export default FeedbackStats;
