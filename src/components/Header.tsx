import React from 'react';

interface HeaderProps {
  text?: string; 
  bgColor?: string; 
  textColor?: string; 
}

const Header: React.FC<HeaderProps> = ({
  text = 'Feedback UI',
  bgColor = 'rgba(0,0,0,0.4)', 
  textColor = '#ff6a95', 
}) => {
  const headerStyles = {
    backgroundColor: bgColor,
    color: textColor,
  };

  return (
    <header style={headerStyles}>
      <div className="container">
        <h2>{text}</h2>
      </div>
    </header>
  );
};

export default Header;
