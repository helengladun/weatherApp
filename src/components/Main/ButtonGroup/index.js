import React from 'react';
import MainpageButton from './Button';

const MainpageButtonGroup = ({handleOpenDialog, handleReset}) => {
  return (
      <div>
        <MainpageButton action={handleOpenDialog}>Add</MainpageButton>
        <MainpageButton action={handleReset}>Go to default</MainpageButton>
      </div>
  );
};

export default MainpageButtonGroup;
