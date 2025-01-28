import { PropagateLoader } from 'react-spinners'; // Import the spinner

const LoadingSpinner = () => {
  return (
    <div style={{
      position: 'absolute',
      top: '50%', // Center vertically
      left: '50%', // Center horizontally
      transform: 'translate(-50%, -50%)',
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
