import { useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { useFormik } from 'formik';

import FormSection from './FormSection';
import { loginSchema } from '../../utils/YupSchema';
import { loginUserFn } from '../../query/fn.auth';
import { setSession } from '../../redux/slice/sessionSlice';
import { LoginRegistrationContainer } from '../../components/styled-components/Container';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: { username: '', password: '' },
    validationSchema: loginSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      loginUserFn(values)
        .then((response) => response.data)
        .then((data) => {
          toast.success('You have logged in successfully.');
          dispatch(setSession(data));
          formik.setSubmitting(false);
          navigate('/');
        })
        .catch((error) => {
          formik.setFieldError('username', 'Incorrect username or password');
          formik.setFieldError('password', 'Incorrect username or password');
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

export default Login;