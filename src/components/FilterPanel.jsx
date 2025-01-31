import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {setFilterName, setFilterPopulation, setLoading} from '../redux/weatherSlice';
import MultiRangeSlider from 'multi-range-slider-react';
import styled from 'styled-components';

const FilterContainer = styled.div`
  padding: 20px;
  border: 1px solid #ccc;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  box-sizing: border-box;
`;


const FilterPanel = () => {
  const dispatch = useDispatch();
  const availablePopulationRange = useSelector((state) => state.weather.availablePopulationRange);
  const [name, setName] = useState('');

  // min and max values that are selected by the user
  const [populationRange] = useState({ min: 0, max: 50000000 });

  // min and max values that will be bounds of the slider
  const [sliderValues, setSliderValues] = useState({min: 0, max: 50000000})

  const handleNameChange = (event) => {
    setName(event.target.value);
  };


  const handleSliderInput = ((e) => {
    dispatch(setLoading(true));
    dispatch(setFilterPopulation({min: e.minValue, max: e.maxValue}));
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setFilterName(name));
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [name, dispatch]);


  useEffect(() => {
    if (availablePopulationRange) {
      // Round min to the lower 5000 and max to the higher 5000
      let min = Math.floor(availablePopulationRange.min / 5000) * 5000;
        let max = Math.ceil(availablePopulationRange.max / 5000) * 5000;
      setSliderValues({min: min, max: max});
    }
  }, [availablePopulationRange]);

  return (
    <FilterContainer>
      <label htmlFor="nameFilter">Filter by Name:</label>
      <Input
        type="text"
        id="nameFilter"
        value={name}
        onChange={handleNameChange}
        placeholder="Enter city name"
      />
        <MultiRangeSlider
          min={sliderValues.min}
          max={sliderValues.max}
          minValue={populationRange.min}
          maxValue={populationRange.max}
          step={5000}
          onChange={(e)=>handleSliderInput(e)}
        />
    </FilterContainer>
  );
};

export default FilterPanel;
