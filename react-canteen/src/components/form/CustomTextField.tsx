import React from 'react';
import { TextField } from "@mui/material";

interface ICustomTextField {
    name: string,
    value: any,
    type:string,
    onChange: (value:any) => void,
    onBlur: (value:any) => void,
    label:string,
    error: boolean,
    disabled: boolean,
    helperText: string,
    extraProps:object | undefined,
    style?: object | undefined
}

const CustomTextField = ({ 
    name, label, value, 
    onChange, onBlur,  type, 
    helperText, error, disabled,
    extraProps, style,
}: ICustomTextField) => {
  return (
    <TextField
            name={name}
              label={label}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              type={type}
              helperText={helperText}
              error={error}
              margin="normal"
              fullWidth
              {...extraProps}
              sx={style}
              disabled={disabled}
            />
  );
};

export default CustomTextField;