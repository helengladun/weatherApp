import React from 'react';

const MainpageButton = ({ action, children }) => {
  return <button onClick={action}>{children}</button>;
};

export default MainpageButton;
