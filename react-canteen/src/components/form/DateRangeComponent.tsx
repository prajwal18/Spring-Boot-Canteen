import { FC } from 'react';
import { useFormik } from 'formik';
import {styled} from '@mui/system';
import { TextField, Box, Stack, Button } from '@mui/material';

// ICON
import SearchIcon from '@mui/icons-material/Search';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
// ICON

import { dateRangeSchema } from '../../utils/YupSchema';

const DateRangeContainer = styled(Box)({
  display: 'flex',
  padding: '10px 20px',
  gap: '10px',
  justifyContent: 'space-between',
  alignItems: 'center',
  maxWidth: '400px',
});

interface IDateRangeComponent {
  handleSubmit: (value: string) => void;
}

const DateRangeComponent: FC<IDateRangeComponent> = ({ handleSubmit }) => {
  const formik = useFormik({
    initialValues: {
      from: '',
      to: '',
    },
    validationSchema: dateRangeSchema,
    enableReinitialize: true,
    onSubmit: (value: any) => {
      const timerange = `${value.from}to${value.to}`;
      handleSubmit(timerange);
    },
  });
  const handleReset = () => {
    formik.setFieldValue('from', '');
    formik.setFieldValue('to', '');
    formik.setErrors({});
    formik.setTouched({}, false);
    handleSubmit('');
  };
  return (
    <Stack
      gap={2}
      alignItems="center"
      justifyContent="space-between"
      direction="row"
      component="form"
      onSubmit={formik.handleSubmit}
    >
      <DateRangeContainer>
        {/* Directly spcifying the error after the toched check is thorowing and error when your field is of type date.*/}
        <TextField
          label="From"
          name="from"
          type="date"
          value={formik.values.from}
          onChange={formik.handleChange}
          fullWidth
          onBlur={formik.handleBlur}
          helperText={
            formik.touched.from && formik.errors.from
              ? formik.errors.from.toString()
              : ''
          }
          error={formik.touched.from && Boolean(formik.errors.from)}
          InputLabelProps={{ shrink: true }}
        />
        <Box sx={{ width: '10px', height: '3px', background: 'black' }}></Box>
        <TextField
          label="To"
          name="to"
          type="date"
          fullWidth
          value={formik.values.to}
          onChange={formik.handleChange}
          helperText={
            formik.touched.to && formik.errors.to
              ? formik.errors.to.toString()
              : ''
          }
          error={formik.touched.to && Boolean(formik.errors.to)}
          InputLabelProps={{ shrink: true }}
        />
      </DateRangeContainer>
      <Stack direction="row" spacing={1}>
        <Button
          sx={{
            background: 'rgba(0,0,0,0.4)',
            color: 'white',
            '&:hover': {
              background: 'rgba(0,0,0,0.7)',
              color: 'whtie',
            },
          }}
          type="submit"
        >
          <SearchIcon/>
        </Button>
        <Button
          sx={{
            background: 'rgba(0,0,0,0.6)',
            color: 'white',
            '&:hover': {
              background: 'rgba(0,0,0,0.9)',
              color: 'whtie',
            },
          }}
          type="button"
          onClick={handleReset}
        >
          <RestartAltIcon/>
        </Button>
      </Stack>
    </Stack>
  );
};

export default DateRangeComponent;
