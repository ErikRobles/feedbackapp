import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  version?: 'primary' | 'secondary' | 'danger'; // Restricting to predefined button styles
  type?: 'button' | 'submit' | 'reset'; // Limited to valid button types
  isDisabled?: boolean; // Optional, defaults to false
}

const Button: React.FC<ButtonProps> = ({ children, version = 'primary', type = 'button', isDisabled = false }) => {
  return (
    <button type={type} disabled={isDisabled} className={`btn btn-${version}`}>
      {children}
    </button>
  );
};

export default Button;
