import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  version?: 'primary' | 'secondary' | 'danger'; // Restricting to predefined button styles
  type?: 'button' | 'submit' | 'reset'; // Limited to valid button types
  isDisabled?: boolean; // Optional, defaults to false
  onClick?: () => void;
}

const Button: React.FC<ButtonProps> = ({ children, version = 'primary', type = 'button', isDisabled = false, onClick, }) => {
  return (
    <button type={type} disabled={isDisabled} className={`btn btn-${version}`} onClick={onClick}>
      {children}
    </button>
  );
};

export default Button;
