import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Checkbox,
  Container,
  Divider,
  FormHelperText,
  TextField,
  Typography
} from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useNavigate } from 'react-router-dom';
import { gql, useMutation } from '@apollo/client';
import UrojAlert from '../components/UrojAlert';

const StationAlert = (props) => {
  const navigate = useNavigate();
  return <UrojAlert
    open={props.ok !== undefined}
    severity={props.ok ? 'success' : 'error'}
    action={
      props.ok ?
        <Button color='inherit' size='small' onClick={() => navigate('/app/station/' + props.id, { replace: true })}>
          查看
        </Button> : null
    }
    info={props.content}
    onClose={props.onClose}
  />;
};


const NewStation = () => {
  const NEW_STATION = gql`
    mutation CreateStation($input: StationInput!){
      createStation(input: $input){
        id,
        title
      }
    }
  `;

  const [createStation, { data }] = useMutation(NEW_STATION);
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
              title: '',
              description: '',
              yaml: '',
              draft: false
            }}
            validationSchema={
              Yup.object().shape({
                title: Yup.string().max(20).required('必须输入标题'),
                description: Yup.string().max(255),
                yaml: Yup.string().required('必须输入yaml'),
                draft: Yup.boolean().required('必须选择')
              })
            }
            onSubmit={(values, helper) => {
              createStation({
                variables: {
                  input: {
                    title: values.title,
                    description: values.description,
                    draft: values.draft,
                    yaml: values.yaml
                  }
                }
              }).then(res => {
                console.log(res.data);
                setRegState({
                  ok: true,
                  content: '车站 ' + res.data.createStation.title + ' 创建成功',
                  id: res.data.createStation.id
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
                  subheader='Create Station'
                  title='创建车站'
                />
                <Divider />
                <form onSubmit={handleSubmit}>
                  <CardContent>
                    <StationAlert {...regState} onClose={() => {
                      setRegState(null);
                    }} />

                    <TextField
                      error={Boolean(touched.title && errors.title)}
                      fullWidth
                      helperText={touched.title && errors.title}
                      label='标题'
                      margin='normal'
                      name='title'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.title}
                      variant='outlined'
                    />
                    <TextField
                      error={Boolean(touched.description && errors.description)}
                      fullWidth
                      helperText={touched.description && errors.description}
                      label='备注'
                      margin='normal'
                      name='description'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.description}
                      variant='outlined'
                    />
                    <TextField
                      error={Boolean(touched.yaml && errors.yaml)}
                      fullWidth
                      multiline
                      minRows={5}
                      maxRows={20}
                      helperText={touched.yaml && errors.yaml}
                      label='车站描述文件'
                      margin='normal'
                      name='yaml'
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.yaml}
                      variant='outlined'
                      InputProps = {{style: {
                        fontFamily: '"Fira code", "Fira Mono", monospace',
                      }}}
                    />
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex',
                        ml: -1
                      }}
                    >
                      <Checkbox
                        checked={values.draft}
                        name='draft'
                        onChange={handleChange}
                      />
                      <Typography
                        color='textSecondary'
                        variant='body1'
                      >
                        草稿
                      </Typography>
                    </Box>
                    {Boolean(touched.draft && errors.draft) && (
                      <FormHelperText error>
                        {errors.draft}
                      </FormHelperText>
                    )}

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
                        创建
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

export default NewStation;
