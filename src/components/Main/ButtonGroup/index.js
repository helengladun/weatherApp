import React from 'react';
import MainpageButton from './Button';

const MainpageButtonGroup = ({handleAdd, handleReset}) => {
  return (
      <div>
        <MainpageButton action={handleAdd}>Add</MainpageButton>
        <MainpageButton action={handleReset}>Go to default</MainpageButton>
      </div>
  );
};

export default MainpageButtonGroup;
