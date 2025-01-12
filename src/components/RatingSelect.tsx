import { useState, useContext, useEffect, ChangeEvent } from 'react';
import FeedbackContext from '../context/FeedbackContext';

interface RatingSelectProps {
  select: (rating: number) => void; // Function to handle the selected rating
}

const RatingSelect: React.FC<RatingSelectProps> = ({ select }) => {
  const [selected, setSelected] = useState<number>(10);

  const feedbackContext = useContext(FeedbackContext);

  if (!feedbackContext) {
    throw new Error('FeedbackContext must be used within a FeedbackProvider');
  }

  const { feedbackEdit } = feedbackContext;

  useEffect(() => {
    if (feedbackEdit.edit === true) {
      setSelected(feedbackEdit.item.rating);
    }
  }, [feedbackEdit]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = +e.currentTarget.value; // Convert value to number
    setSelected(value);
    select(value);
  };

  return (
    <ul className="rating">
      {[...Array(10)].map((_, index) => {
        const ratingValue = index + 1;
        return (
          <li key={ratingValue}>
            <input
              type="radio"
              id={`num${ratingValue}`}
              name="rating"
              value={ratingValue}
              onChange={handleChange}
              checked={selected === ratingValue}
            />
            <label htmlFor={`num${ratingValue}`}>{ratingValue}</label>
          </li>
        );
      })}
    </ul>
  );
};

export default RatingSelect;
