import React, { FC, useEffect } from 'react';
import {
  Box,
  Stack,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import { addEditItemSchema } from '../../utils/YupSchema';
import { AppDispatch } from '../../redux/store';
import { AddEditItemType } from '../../query/fn.item';
import CustomSelect from '../form/CustomSelect';
import {
  selectCategoriesDD,
} from '../../redux/slice/categorySlice';
import { addItem, editItem, selectSelectedItem } from '../../redux/slice/itemSlice';

interface IAddEditItem {
  open: boolean;
  handleClose: () => void;
  isEditing: boolean;
}

const addItemIV: AddEditItemType = {
  name: '',
  price: 0,
  category: '',
  photoURL: '',
  description: '',
};

const AddEditItem: FC<IAddEditItem> = ({ open, handleClose, isEditing }) => {
  const dispatch = useDispatch<AppDispatch>();
  const categoriesDD = useSelector(selectCategoriesDD);
  const item = useSelector(selectSelectedItem);

  const handleCategoryChange = (e: any) => {
    formik.setFieldValue('category', e.target.value);
  };

  const formik = useFormik({
    initialValues: addItemIV,
    validationSchema: addEditItemSchema,
    enableReinitialize: true,
    onSubmit: (value: any) => {
      console.log(value)
      if (isEditing) {
        dispatch(editItem(value));
      } else {
        dispatch(addItem(value));
      }
      formik.resetForm();
      handleClose();
    },
  });

  useEffect(() => {
    if (isEditing) {
      formik.setFieldValue('name', item.name);
      formik.setFieldValue('price', item.price);
      formik.setFieldValue('category', item.category.id);
      formik.setFieldValue('photoURL', item.photoURL);
      formik.setFieldValue('description', item.description);
    }
  }, [isEditing]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md">
      <DialogTitle id="add-item">{`Add Item`}</DialogTitle>
      <DialogContent>
        <Stack direction="row" gap={2}>
          <Stack
            spacing={2}
            sx={{ minWidth: '350px' }}
            component="form"
            onSubmit={formik.handleSubmit}
            mt={2}
          >
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
            <TextField
              label="Price"
              name="price"
              type="number"
              inputProps={{
                step: 0.01,
              }}
              value={formik.values.price}
              onChange={formik.handleChange}
              fullWidth
              onBlur={formik.handleBlur}
              helperText={
                formik.touched.price && formik.errors.price
                  ? formik.errors.price.toString()
                  : ''
              }
              error={formik.touched.price && Boolean(formik.errors.price)}
            />
            {/* CATEGORY */}
            <Box>
              <CustomSelect
                label={'Category'}
                id="select-category"
                value={formik.values.category}
                options={categoriesDD}
                handleChange={handleCategoryChange}
              />
              <Typography sx={{ color: 'red', mt: 1 }}>
                {formik.touched.category &&
                  Boolean(formik.errors.category) &&
                  formik.errors.category?.toString()}
              </Typography>
            </Box>
            {/* CATEGORY */}
            <TextField
              label="Photo URL"
              name="photoURL"
              type="text"
              value={formik.values.photoURL}
              onChange={formik.handleChange}
              fullWidth
              onBlur={formik.handleBlur}
              helperText={
                formik.touched.photoURL && formik.errors.photoURL
                  ? formik.errors.photoURL.toString()
                  : ''
              }
              error={formik.touched.photoURL && Boolean(formik.errors.photoURL)}
            />
            <TextField
              label="Description"
              name="description"
              type="text"
              value={formik.values.description}
              onChange={formik.handleChange}
              fullWidth
              onBlur={formik.handleBlur}
              helperText={
                formik.touched.description && formik.errors.description
                  ? formik.errors.description.toString()
                  : ''
              }
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              multiline
              rows={2}
            />
            <Button
              sx={{ width: '100%', mt: 2 }}
              variant="outlined"
              type="submit"
            >
              Submit
            </Button>
          </Stack>
          {/* Picture section */}
          <PictureSection
            src={formik.values.photoURL}
            alt={formik.values.name}
          />
          {/* Picture section */}
        </Stack>
      </DialogContent>
    </Dialog>
  );
};

const PictureSection = ({ src, alt }: { src: string; alt: string }) => {
  return (
    <Box sx={{ flexGrow: '1', p: 2 }}>
      <img
        src={src}
        alt={alt}
        style={{
          display: 'block',
          width: '100%',
          maxWidth: '400px',
          height: '100%',
          objectFit: 'cover',
        }}
        onError={({ currentTarget }) => {
          currentTarget.onerror = null; // prevents looping
          currentTarget.src = process.env.REACT_APP_IMAGE_NOT_FOUND || '';
        }}
      />
    </Box>
  );
};

export default AddEditItem;
