import React, { FC, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import {
  addCategory, editCategory, selectSelectedCategory,
} from '../../redux/slice/categorySlice';
import { useFormik } from 'formik';
import { addEditCategorySchema } from '../../utils/YupSchema';
import { AppDispatch } from '../../redux/store';

interface IAddEditCategory {
  open: boolean;
  handleClose: () => void;
  isEditing: boolean
}

const AddEditCategory: FC<IAddEditCategory> = ({ open, handleClose, isEditing }) => {
  const category = useSelector(selectSelectedCategory);
  const dispatch = useDispatch<AppDispatch>();
  const formik = useFormik({
    initialValues: { name: '' },
    validationSchema: addEditCategorySchema,
    enableReinitialize: true,
    onSubmit: (value: any) => {
      if(isEditing){
        dispatch(editCategory(value));
      } else {
        dispatch(addCategory(value));
      }
      formik.resetForm();
      handleClose();
    },
  });

  useEffect(() => {
    if (isEditing && category?.name) {
      formik.setFieldValue('name', category.name);
    }
  }, [category, isEditing]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle id="add-edit-category">{`Add Edit Category.`}</DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={formik.handleSubmit} mt={2}>
          <TextField
            label="Name"
            name="name"
            type="text"
            value={formik.values.name}
            onChange={formik.handleChange}
            fullWidth
            onBlur={formik.handleBlur}
            helperText={
              formik.touched.name && formik.errors.name
                ? formik.errors.name.toString()
                : ''
            }
            error={formik.touched.name && Boolean(formik.errors.name)}
          />
          <Button
            sx={{ width: '100%', mt: 2 }}
            variant="outlined"
            type="submit"
          >
            Submit
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default AddEditCategory;
