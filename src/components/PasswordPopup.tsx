import React, { useState } from 'react';

interface PasswordPopupProps {
  onSubmit: (password: string) => void;
  onClose: () => void;
  passwordError: string | null;
}

const PasswordPopup: React.FC<PasswordPopupProps> = ({ onSubmit, passwordError, onClose }) => {
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
        {passwordError && <p className="error">{passwordError}</p>}
      </form>
    </div>
  );
};

export default PasswordPopup;
