import { motion, AnimatePresence } from 'framer-motion';
import { useContext } from 'react';
import FeedbackItem from './FeedbackItem';
import FeedbackContext from '../context/FeedbackContext';
import { Feedback } from '../types/feedbackTypes';
import Spinner from './shared/Spinner';

const FeedbackList: React.FC = () => {
  const feedbackContext = useContext(FeedbackContext);

  if (!feedbackContext) {
    throw new Error('FeedbackContext must be used within a FeedbackProvider');
  }

  const { feedback, isLoading } = feedbackContext;

  if (!isLoading && (!feedback || feedback.length === 0)) {
    return <p>No feedback yet.</p>;
  }

  return isLoading ? <Spinner /> : (
    <div className="feedback-list">
    <AnimatePresence>
      {feedback.map((item: Feedback, index: number) => (
        <motion.div
        key={item.id || `fallback-key-${index}`}
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
