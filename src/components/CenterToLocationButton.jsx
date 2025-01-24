import React from 'react';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';
import { fetchUserLocation } from '../redux/weatherSlice';

const CenteringButton = styled.button`
  padding: 10px 15px;
  background-color: #4CAF50; /* Green */
  border: none;
  color: white;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 16px;
  margin: 10px;
  cursor: pointer;
  border-radius: 5px;

    &:hover{
        background-color: #45a049;
    }
`;

const CenterToLocationButton = () => {
    const dispatch = useDispatch();

    const handleCenterClick = () => {
        dispatch(fetchUserLocation());
    };

    return (
        <CenteringButton onClick={handleCenterClick}>
            Center to My Location
        </CenteringButton>
    );
};

export default CenterToLocationButton;