import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { Box, Button, Checkbox, Container, FormHelperText, Link, TextField, Typography } from '@material-ui/core';
import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';
import UrojAlert from '../components/UrojAlert';
import { SIGN_UP } from '../mixins/game/schema';

const SignupAlert = (props) => {
  const navigate = useNavigate();
  return <UrojAlert
    open={props.ok !== undefined}
    severity={props.ok ? 'success' : 'error'}
    action={
      props.ok ?
        <Button color='inherit' size='small' onClick={() => navigate('/login', { replace: true })}>
          去登陆
        </Button> : null
    }
    info={props.content}
    onClose={props.onClose}
  />;
};

const Register = () => {
  const [signUp, { data }] = useMutation(SIGN_UP);
  const [regState, setRegState] = useState(null);

  return (
    <>
      <Helmet>
        <title>注册 | UROJ</title>
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
          <SignupAlert {...regState} onClose={() => {
            setRegState(null);
          }} />
          <Formik
            initialValues={{
              email: '',
              uid: '',
              password: '',
              policy: false
            }}
            validationSchema={
              Yup.object().shape({
                email: Yup.string().email('邮箱格式非法').max(255).required('必须输入邮箱'),
                uid: Yup.string().max(255).required('必须输入ID'),
                password: Yup.string().max(255).required('必须输入密码'),
                policy: Yup.boolean().oneOf([true], '必须同意本项')
              })
            }
            onSubmit={(values, helper) => {
              signUp({
                variables: {
                  input: {
                    id: values.uid,
                    email: values.email,
                    password: values.password
                  }
                }
              }).then(res => {
                setRegState({
                  ok: true,
                  content: '用户' + res.data.signUp.id + '注册成功'
                });
              }).catch(e => {
                setRegState({
                  ok: false,
                  content: '' + e
                });
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
                    注册新账户
                  </Typography>
                  <Typography
                    color='textSecondary'
                    gutterBottom
                    variant='body2'
                  >
                    使用电子邮箱注册新账户
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
                  error={Boolean(touched.email && errors.email)}
                  fullWidth
                  helperText={touched.email && errors.email}
                  label='邮箱'
                  margin='normal'
                  name='email'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type='email'
                  value={values.email}
                  variant='outlined'
                />
                <TextField
                  error={Boolean(touched.password && errors.password)}
                  fullWidth
                  helperText={touched.password && errors.password}
                  label='密码'
                  margin='normal'
                  name='password'
                  onBlur={handleBlur}
                  onChange={handleChange}
                  type='password'
                  value={values.password}
                  variant='outlined'
                />
                <Box
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    ml: -1
                  }}
                >
                  <Checkbox
                    checked={values.policy}
                    name='policy'
                    onChange={handleChange}
                  />
                  <Typography
                    color='textSecondary'
                    variant='body1'
                  >
                    我已经阅读并同意
                    {' '}
                    <Link
                      color='primary'
                      component={RouterLink}
                      to='#'
                      underline='always'
                      variant='h6'
                    >
                      UROJ 用户政策与条款
                    </Link>
                  </Typography>
                </Box>
                {Boolean(touched.policy && errors.policy) && (
                  <FormHelperText error>
                    {errors.policy}
                  </FormHelperText>
                )}
                <Box sx={{ py: 2 }}>
                  <Button
                    color='primary'
                    disabled={isSubmitting}
                    fullWidth
                    size='large'
                    type='submit'
                    variant='contained'
                  >
                    注册
                  </Button>
                </Box>
                <Typography
                  color='textSecondary'
                  variant='body1'
                >
                  已经有账户了？
                  {' '}
                  <Link
                    component={RouterLink}
                    to='/login'
                    variant='h6'
                  >
                    登入
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

export default Register;
