import { motion, AnimatePresence } from 'framer-motion';
import { useContext } from 'react';
import FeedbackItem from './FeedbackItem';
import FeedbackContext from '../context/FeedbackContext';
import { Feedback } from '../types/feedbackTypes';

const FeedbackList: React.FC = () => {
  const feedbackContext = useContext(FeedbackContext);

  if (!feedbackContext) {
    throw new Error('FeedbackContext must be used within a FeedbackProvider');
  }

  const { feedback } = feedbackContext;

  if (!feedback || feedback.length === 0) {
    return <p>No feedback yet.</p>;
  }

  return (
    <div className="feedback-list">
      <AnimatePresence>
        {feedback.map((item: Feedback) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <FeedbackItem item={item} />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FeedbackList;
