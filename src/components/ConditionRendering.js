/* eslint-disable no-eval */
import { Box } from '@mui/material';
import React from 'react';

const ConditionRendering = ({ children, conditionString }) => {
  return <>{conditionString ? <Box>{children}</Box> : null}</>;
};

export default ConditionRendering;
