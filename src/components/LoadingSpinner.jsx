import React from 'react';
import { PropagateLoader } from 'react-spinners'; // Or another spinner library

const LoadingSpinner = () => {
  return (
    <div style={{
      position: 'absolute', // Position the spinner absolutely
      top: '50%', // Center vertically
      left: '50%', // Center horizontally
      transform: 'translate(-50%, -50%)', // Center precisely
      zIndex: 1000, // Ensure it's on top of the map
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
        <PropagateLoader color="#36D7B7" loading={true} size={15} />
    </div>
  );
};

export default LoadingSpinner;
