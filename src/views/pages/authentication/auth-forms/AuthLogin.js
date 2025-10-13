import PropTypes from 'prop-types';
import React from 'react';
import { useTheme } from '@mui/material/styles';
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput
} from '@mui/material';
import * as Yup from 'yup';
import { Formik } from 'formik';
import AnimateButton from 'ui-component/extended/AnimateButton';
import useAuth from 'hooks/useAuth';
import useScriptRef from 'hooks/useScriptRef';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const JWTLogin = ({ ...others }) => {
  const theme = useTheme();
  const { login } = useAuth();
  const scriptedRef = useScriptRef();
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword(!showPassword);
  const handleMouseDownPassword = (event) => event.preventDefault();

  return (
    <Formik
      initialValues={{ email: '', password: '', submit: null }}
      validationSchema={Yup.object().shape({
        email: Yup.string().email('Must be a valid email').max(255).required('Email is required'),
        password: Yup.string().max(255).required('Password is required')
      })}
      onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
        try {
          await login(values.email, values.password);
          if (scriptedRef.current) {
            setStatus({ success: true });
            setSubmitting(false);
          }
        } catch (err) {
          if (scriptedRef.current) {
            setStatus({ success: false });
            setErrors({ submit: err.message || 'Login failed' });
            setSubmitting(false);
          }
        }
      }}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
        <form noValidate onSubmit={handleSubmit} {...others}>
          <FormControl fullWidth error={Boolean(touched.email && errors.email)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-email-login">Email Address</InputLabel>
            <OutlinedInput
              id="outlined-adornment-email-login"
              type="email"
              value={values.email}
              name="email"
              onBlur={handleBlur}
              onChange={handleChange}
            />
            {touched.email && errors.email && <FormHelperText error>{errors.email}</FormHelperText>}
          </FormControl>

          <FormControl fullWidth error={Boolean(touched.password && errors.password)} sx={{ ...theme.typography.customInput }}>
            <InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
            <OutlinedInput
              id="outlined-adornment-password-login"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              name="password"
              onBlur={handleBlur}
              onChange={handleChange}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                    size="large"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
            {touched.password && errors.password && <FormHelperText error>{errors.password}</FormHelperText>}
          </FormControl>

          {errors.submit && (
            <Box sx={{ mt: 3 }}>
              <FormHelperText error>{errors.submit}</FormHelperText>
            </Box>
          )}

          <Box sx={{ mt: 2 }}>
            <AnimateButton>
              <Button color="secondary" disabled={isSubmitting} fullWidth size="large" type="submit" variant="contained">
                Sign In
              </Button>
            </AnimateButton>
          </Box>
        </form>
      )}
    </Formik>
  );
};

JWTLogin.propTypes = {
  loginProp: PropTypes.number
};

export default JWTLogin;
