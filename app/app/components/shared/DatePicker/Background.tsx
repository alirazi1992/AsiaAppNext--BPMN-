import React from 'react';

interface BackgroundProps {
  onClick: () => void;
}

const Background: React.FC<BackgroundProps> = ({ onClick }) => {
  return (
    <div
      style={{
        position: 'fixed',
        height: '100%',
        width: '100%',
        backgroundColor: 'rgba(0,0,0,.3)',
        top: '0',
        left: '0',
      }}
      className="JDBackground"
      onClick={onClick}
    />
  );
};

export default Background;