import React, { FC, useState } from 'react';
import { Box, InputAdornment, TextField, TextFieldProps } from '@mui/material';

// ICONS
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
// ICONS

// interface ICustomPasswordField {
//   inputProps: any;
// }
// : FC<ICustomPasswordField>
const CustomPasswordField = (props: TextFieldProps) => {
  const [visible, setVisible] = useState(false);
  const toggleVisibility = () => {
    setVisible(!visible);
  };
  return (
    <TextField
      type={visible ? 'text' : 'password'}
      {...props}
      InputProps={{
        endAdornment: (
          <InputAdornment position="start" sx={{cursor:"pointer"}} onClick={toggleVisibility}>
            {visible ? <VisibilityOffIcon /> : <VisibilityIcon />}
          </InputAdornment>
        ),
      }}
    />
  );
};

export default CustomPasswordField;
