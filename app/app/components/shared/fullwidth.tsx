'use client';
import React, { useEffect } from 'react';
const FullWidthComponent = () => {
  const toggleFullScreen = () => {
    if (typeof window !== 'undefined') {
      const element = document.documentElement;
      if (!document.fullscreenElement) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  };
  const handleKeyPress = (event: any) => {
    if (typeof window !== 'undefined') {
      if (event.key === 'Escape') {
        if (document.exitFullscreen) {
          document.exitFullscreen();
        }
      }
    }
  };
  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.addEventListener('keydown', handleKeyPress);
      return () => {
        document.removeEventListener('keydown', handleKeyPress);
      };
    }
  }, []);
  return (
    <div>
      <button id="fullWidthIcon" onClick={toggleFullScreen}>
        Full Width
      </button>
      <p>Content goes here...</p>
    </div>
  );
};

export default FullWidthComponent;