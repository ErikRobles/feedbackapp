import React, { useState } from 'react';

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
    setPassword(''); // Clear the password input
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>Enter Password</h3>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Submit</button>
          <button type="button" onClick={onClose}>
            Cancel
          </button>
        </form>
        {errorMessage && <p style={{ color: 'red', marginTop: '10px' }}>{errorMessage}</p>}
      </div>
    </div>
  );
};

export default PasswordPopup;
