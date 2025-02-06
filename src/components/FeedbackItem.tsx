import { FaTimes, FaEdit } from 'react-icons/fa';
import { useContext } from 'react';
import Card from './shared/Card';
import FeedbackContext from '../context/FeedbackContext';
import { Feedback } from '../types/feedbackTypes';

interface FeedbackItemProps {
  item: Feedback; // Define the type for the `item` prop
}

const FeedbackItem: React.FC<FeedbackItemProps> = ({ item }) => {
  const feedbackContext = useContext(FeedbackContext);

  if (!feedbackContext) {
    throw new Error('FeedbackContext must be used within a FeedbackProvider');
  }

  const { deleteFeedback, editFeedback } = feedbackContext;

  return (
    <Card>
      <div className="num-display">{item.rating}</div>
      <button className="edit" onClick={() => {
        console.log('📝 Edit button clicked'); 
        editFeedback(item);
      }}>
        <FaEdit color="purple" />
      </button>
      <button className="close" onClick={() => {
        const feedbackId = item.id || item._id;
        if (feedbackId) {
          deleteFeedback(feedbackId);
        } else {
          console.error("Error: Trying to delete an item without an ID", item);
        }
      }}>
        <FaTimes color="purple" />
      </button>
      <div className="text-display">{item.text}</div>
    </Card>
  );
};

export default FeedbackItem;
