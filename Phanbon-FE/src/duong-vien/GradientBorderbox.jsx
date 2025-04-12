import React from 'react';

const GradientBorderBox = ({ children, className = '' }) => {
  return (
    <div className={`gradient-border-box ${className}`}>
      {children}
    </div>
  );
};

export default GradientBorderBox;