import { useFormik } from 'formik';
import FormSection from './FormSection';
import { registrationSchema } from '../../utils/YupSchema';
import { registerUserFn } from '../../query/fn.user';
import { StatusCodes } from 'http-status-codes';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { LoginRegistrationContainer } from '../../components/styled-components/Container';

const Register = () => {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { username: '', password: '', email: '', roles: [''] },
    validationSchema: registrationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      registerUserFn(values)
        .then((response) => {
          if (response.status === StatusCodes.CREATED) {
            toast.success('User created successfully');
            navigate('/login');
          }
        })
        .catch((error) => {
          formik.setFieldError('username', 'Duplicate username or email');
          formik.setFieldError('email', 'Duplicate username or email');
          formik.setSubmitting(false);
        });
    },
  });

  return (
    <LoginRegistrationContainer>
      <FormSection formik={formik} />
    </LoginRegistrationContainer>
  );
};

export default Register;
