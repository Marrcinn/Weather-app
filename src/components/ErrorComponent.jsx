import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import { clearError } from '../redux/weatherSlice';

const ErrorComponenet = styled.div`
    padding: 10px 15px;
`;

const CenterToLocationButton = () => {
    const dispatch = useDispatch();
    const error = useSelector((state) => state.weather.error);


    return (
        <ErrorComponenet>
            <div>
            {error &&
                <div style={{ display:'flex', flexDirection:"row"  }}>
                    <p style={{color: 'red'}}>{error}</p>
                    <button onClick={() => dispatch(clearError())}>Clear error</button>
                </div>
            }
            </div>
        </ErrorComponenet>
    );
};

export default CenterToLocationButton;
