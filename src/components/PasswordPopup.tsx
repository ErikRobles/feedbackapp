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
  };

  return (
    <div className="popup">
      <form onSubmit={handleSubmit}>
        <h3>Enter Password</h3>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter password"
        />
        <button type="submit">Submit</button>
        <button type="button" onClick={onClose}>
          Cancel
        </button>
        {errorMessage && <p className="error">{errorMessage}</p>}
      </form>
    </div>
  );
};

export default PasswordPopup;
