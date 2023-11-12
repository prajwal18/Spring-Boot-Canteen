import * as yup from 'yup';

export const loginSchema = yup.object().shape({
  username: yup.string().required('Specify your username'),
  password: yup
    .string()
    .required('Sprcify your password')
    .min(8, 'password cannot be shorter than 8 characters.'),
});

export const registrationSchema = yup.object().shape({
  username: yup
    .string()
    .required('Specify your username')
    .min(3, 'username has to longer than 3 characters.'),
  password: yup
    .string()
    .required('Specify your password')
    .min(8, 'password cannot be shorter than 8 characters.'),
  email: yup.string().email().required('Specify your email'),
});

export const dateRangeSchema = yup.object().shape({
  from: yup.date().required('Specify the start date'),
  to: yup
    .date()
    .required('Specify the end date')
    .test({
      name: 'to',
      message: 'Invalid date range. End date > start date.',
      test: (value: any, drs) => {
        const from = drs.parent.from;
        console.log('value > from ', value > from);
        return value > from;
      },
    }),
});

export const addEditCategorySchema = yup.object().shape({
  name: yup
    .string()
    .required('Specify a name for the category.')
    .min(3, 'Category name cannot be shorter than 3 characters.'),
});

export const addEditItemSchema = yup.object().shape({
  name: yup
    .string()
    .required('Specify a name for the item.')
    .min(3, 'Item name cannot be shorter than 3 characters.'),
  photoURL: yup.string().required(),
  description: yup
    .string()
    .required()
    .min(10, 'Description has to at least 10 characters long'),
  price: yup.number().required().min(1),
  category: yup.number().required().notOneOf([0], 'Select a category'),
});

export const changePasswordSchema = yup.object().shape({
  oldPassword: yup.string().required('Specify your old password'),
  newPassword: yup
    .string()
    .required('Specify your new password.')
    .min(8, 'New password cannot be shorter than 8 characters.'),
});

export const addEditUserSchema = yup.object().shape({
  username: yup
    .string()
    .required('Specify your username')
    .min(3, 'username has to longer than 3 characters.'),
  password: yup
    .string()
    .required('Specify your password')
    .min(8, 'password cannot be shorter than 8 characters.'),
  email: yup.string().email().required('Specify your email'),
  roles: yup
    .array()
    .of(yup.string())
    .required('Specify a role')
    .min(1, 'User needs to have at least one role'),
});

export const addEditOrderSchema = yup.object().shape({
  owner: yup.number().required().min(1, 'Select a valid user'),
  items: yup
    .array()
    .of(yup.number())
    .required('Select an item')
    .min(1, 'A order needs to have at least one item.'),
});

export const forgotPasswordSchema = [
  yup.object().shape({
    email: yup.string().email().required(),
  }),
  yup.object().shape({
    otp: yup.string().required().length(6, 'OTP should be 6 characters long.'),
  }),
  yup.object().shape({
    newPassword: yup
      .string()
      .min(8, 'password cannot be shorter than 8 characters.'),
    rePassword: yup
      .string()
      .min(8, 'password cannot be shorter than 8 characters.')
      .oneOf([yup.ref('newPassword')], "The passwords don't match"),
  }),
];
