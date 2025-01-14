import React, { useState } from 'react';
import Card from './shared/Card';        
import Button from './shared/Button';     // Optionally use your custom Button component

interface PasswordPopupProps {
  onSubmit: (password: string) => void;
  onClose: () => void;
  errorMessage: string | null;
}

const PasswordPopup: React.FC<PasswordPopupProps> = ({ onSubmit, onClose, errorMessage }) => {
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(password);
  };

  return (
    <div className="modal-overlay">
      {/* Use your Card component as the modal "card" */}
      <Card>
        <h3>Enter Password</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
          />
          <div className="button-group">
            {/* Optionally use your <Button> wrapper, or just plain <button> */}
            <Button type="submit">Submit</Button>
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
          </div>
          {/* Display errors if they exist */}
          {errorMessage && <p className="popup-error">{errorMessage}</p>}
        </form>
      </Card>
    </div>
  );
};

export default PasswordPopup;
