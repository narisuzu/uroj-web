import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  TextField
} from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { gql, useMutation } from '@apollo/client';
import UrojAlert from '../components/UrojAlert';
import { useNavigate } from 'react-router-dom';

const ExecutorAlert = (props) => {
  const navigate = useNavigate();
  return <UrojAlert
    open={props.ok !== undefined}
    severity={props.ok ? 'success' : 'error'}
    info={props.content}
    onClose={props.onClose}
  />;
};


const NewExecutor = () => {
  const NEW_EXECUTOR = gql`
    mutation CreateExecutor($url: String!){
      createExecutor(url: $url){
        id,
        addr
      }
    }
  `;

  const [createExecutor, { data }] = useMutation(NEW_EXECUTOR);
  const [regState, setRegState] = useState(null);

  return (
    <>
      <Helmet>
        <title>新建车站 | UROJ</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <Container maxWidth='lg'>
          <Formik
            initialValues={{
              url: '127.0.0.1:8003'
            }}
            validationSchema={
              Yup.object().shape({
                url: Yup.string().required('必须输入URL')
              })
            }
            onSubmit={(values, helper) => {
              createExecutor({
                variables: {
                    url: values.url,
                }
              }).then(res => {
                console.log(res.data);
                setRegState({
                  ok: true,
                  content: '运行时 ' + res.data.createExecutor.addr + ' 添加成功',
                  id: res.data.createExecutor.id
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
              <Card>
                <CardHeader
                  subheader='Add Executor'
                  title='添加运行时'
                />
                <Divider />
                <form onSubmit={handleSubmit}>
                  <CardContent>
                    <ExecutorAlert {...regState} onClose={() => {
                      setRegState(null);
                    }}
                    />
                    <TextField
                      error={Boolean(touched.url && errors.url)}
                      fullWidth
                      helperText={touched.url && errors.url}
                      label='URL'
                      margin='normal'
                      name='url'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.url}
                      variant='outlined'
                    />
                  </CardContent>
                  <Divider />
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'flex-end',
                      p: 2
                    }}
                  >
                    <CardActions>
                      <Button
                        color='primary'
                        disabled={isSubmitting}
                        size='large'
                        type='submit'
                        variant='contained'
                      >
                        添加
                      </Button>
                    </CardActions>
                  </Box>
                </form>
              </Card>
            )}
          </Formik>
        </Container>
      </Box>
    </>
  );
};

export default NewExecutor;
