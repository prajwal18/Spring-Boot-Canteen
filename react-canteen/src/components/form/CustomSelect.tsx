import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';

interface ICustomSelect {
  label: string;
  id: string;
  value: any;
  options: DropDownOptionsType;
  handleChange: (value: any) => void;
}

type DropDownOptionsType = Array<{ id: any; name: string }>;

const CustomSelect = ({
  label,
  id,
  value,
  options,
  handleChange,
}: ICustomSelect) => {
  return (
    <FormControl fullWidth>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        labelId={`${id}-label`}
        id={id}
        value={value}
        label={label}
        onChange={handleChange}
      >
        {options.map((item, index) => (
          <MenuItem key={`${item.name}-item-${index}`} value={item.id}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;
