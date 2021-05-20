import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { gql, useMutation } from '@apollo/client';

import { useState } from 'react';
import { Alert, Box, Button, Container, Link, Snackbar, TextField, Typography } from '@material-ui/core';
import UrojAlert from '../components/UrojAlert';
import { SIGN_IN } from '../mixins/game/schema';

const Login = () => {
  const navigate = useNavigate();

  const [signIn, { data }] = useMutation(SIGN_IN);
  const [errState, setErrState] = useState(null);

  return (
    <>
      <Helmet>
        <title>登录 | Material Kit</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          justifyContent: 'center'
        }}
      >
        <Container maxWidth='sm'>
          <UrojAlert open={errState !== null} severity='error' info={errState} onClose={
            () => setErrState(null)
          }/>
          <Formik
            initialValues={{
              uid: 'zhray',
              password: 'kotori2333'
            }}
            validationSchema={Yup.object().shape({
              uid: Yup.string().max(255).required('必须输入用户ID'),
              password: Yup.string().max(255).required('必须输入密码')
            })}
            onSubmit={(values, helper) => {
              signIn({
                variables: {
                  input: {
                    id: values.uid,
                    password: values.password
                  }
                }
              }).then(res => {
                localStorage.setItem('token', res.data.signIn);
                navigate('/app/dashboard', { replace: true });
              }).catch(e => {
                setErrState(""+e);
              }).finally(() => {
                helper.setSubmitting(false);
              });
            }}
          >
            {({
                errors,
                handleBlur,
                handleChange,
                handleSubmit,
                isSubmitting,
                touched,
                values
              }) => (
              <form onSubmit={handleSubmit}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    color='textPrimary'
                    variant='h2'
                  >
                    登入
                  </Typography>
                  <Typography
                    color='textSecondary'
                    gutterBottom
                    variant='body2'
                  >
                    登入Universal Railway Online Judge，使用全部服务
                  </Typography>
                </Box>

                <TextField
                  error={Boolean(touched.uid && errors.uid)}
                  fullWidth
                  helperText={touched.uid && errors.uid}
                  label='ID'
                  margin='normal'
                  name='uid'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  value={values.uid}
                  variant='outlined'
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label='Password'
                  margin='normal'
                  name='password'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type='password'
                  value={values.password}
                  variant='outlined'
                />
                <Box sx={{ py: 2 }}>
                  <Button
                    color='primary'
                    disabled={isSubmitting}
                    fullWidth
                    size='large'
                    type='submit'
                    variant='contained'
                  >
                    登入
                  </Button>
                </Box>
                <Typography
                  color='textSecondary'
                  variant='body1'
                >
                  还没有账户？
                  {' '}
                  <Link
                    component={RouterLink}
                    to='/register'
                    variant='h6'
                  >
                    注册
                  </Link>
                </Typography>
              </form>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  );
};

export default Login;
