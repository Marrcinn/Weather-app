import React, { useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setFilterName, setFilterPopulation } from '../redux/weatherSlice';
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

const SliderContainer = styled.div`
    display: flex;
    align-items: center;
`

const Label = styled.label`
    margin-right: 10px;
`

const RangeInput = styled.input`
    width: 100%;
`

const FilterPanel = () => {
  const dispatch = useDispatch();
  const cities = useSelector((state) => state.weather.cities);
  const [name, setName] = useState('');
  const [populationRange, setPopulationRange] = useState({ min: 0, max: 0 });
  const [sliderValues, setSliderValues] = useState({min: 0, max: 0})

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePopulationChange = useCallback((event) => {
    const values = event.target.value.split(',').map(Number)
    setSliderValues({min: values[0], max: values[1]})
    setPopulationRange({ min: values[0], max: values[1] });
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      dispatch(setFilterName(name));
    }, 200);

    return () => clearTimeout(timeoutId);
  }, [name, dispatch]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
        dispatch(setFilterPopulation(populationRange));
    }, 200);

    return () => clearTimeout(timeoutId);
}, [populationRange, dispatch]);

  useEffect(() => {
    if (cities.length > 0) {
      const populations = cities.map((city) => city.population).filter(pop => pop > 0);
      const minPop = Math.min(...populations);
      const maxPop = Math.max(...populations);
      setSliderValues({min: minPop, max: maxPop})
      setPopulationRange({ min: minPop, max: maxPop });
    }
  }, [cities]);

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
        <SliderContainer>
            <Label htmlFor="populationFilter">Filter by Population:</Label>
          <RangeInput
              type="range"
              id="minPopulation"
              name="min"
              min={populationRange.min}
              max={populationRange.max}
          />
          <RangeInput
              type="range"
              id="maxPopulation"
              name="max"
              min={populationRange.min}
              max={populationRange.max}
          />
            <Label>Min: {populationRange.min}</Label>
            <Label>Max: {populationRange.max}</Label>
        </SliderContainer>
    </FilterContainer>
  );
};

export default FilterPanel;
