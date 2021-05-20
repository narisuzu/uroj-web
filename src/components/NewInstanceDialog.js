import React, { useState } from 'react';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField
} from '@material-ui/core';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { gql } from '@apollo/client/core';
import { useMutation, useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import UrojAlert from './UrojAlert';
import moment from 'moment';
import { ADD_INSTANCE, GET_NEW_INS_INFO } from '../mixins/game/schema';

const InsAlert = (props) => {
  const navigate = useNavigate();
  return <UrojAlert
    open={props.ok !== undefined}
    severity={props.ok ? 'success' : 'error'}
    action={
      props.ok ?
        <Button color='inherit' size='small'
                onClick={() => navigate('/instance/' + props.id, { state: { uri: props.uri } })}>
          去实例
        </Button> : null
    }
    info={props.content}
    onClose={props.onClose}
  />;
};

export default function NewInstanceDialog(props) {

  let chType;
  if (props.value !== null) {
    switch (props.value.type) {
      case 'exam':
        chType = '考试';
        break;
      case 'train':
        chType = '练习';
        break;
      default:
        chType = '';
        break;
    }
  }

  const [addInstance] = useMutation(ADD_INSTANCE);
  const [regState, setRegState] = useState(null);

  const { loading, error, data } = useQuery(GET_NEW_INS_INFO);
  if (loading) return 'loading';
  if (error) {
    console.log(error);
    return;
  }

  return (
    <Dialog open={props.open} onClose={props.onClose} aria-labelledby='form-dialog-title'>
      <InsAlert {...regState} onClose={() => {
        setRegState(null);
      }} />
      <DialogTitle id='form-dialog-title'>创建{chType}实例</DialogTitle>
      <DialogContent>
        <DialogContentText>
          创建实例，请指定您想运行该实例的运行时、以及相关内容
        </DialogContentText>
        <Formik
          initialValues={{
            title: '',
            description: '',
            player: data.me.id,
            executor: 1
          }}

          validationSchema={
            Yup.object().shape({
              title: Yup.string().max(20).required('必须输入实例标题'),
              description: Yup.string().max(100)
            })
          }

          onSubmit={(values, { setSubmitting }) => {
            addInstance({
              variables: {
                input: {
                  title: values.title,
                  executorId: parseInt(values.executor),
                  description: values.description,
                  player: values.player,
                  stationId: props.id
                }
              }
            }).then(res => {
              const data = res.data.createInstance;
              setRegState({
                ok: true,
                id: data.id,
                uri: data.executor.addr,
                content: '为用户' + data.player + '创建实例' + data.title + '成功，开始于: ' + moment(data.beginAt).format('MM/DD HH:mm:ss')
              });
            }).catch(e => {
              setRegState({
                ok: false,
                content: '' + e
              });
            }).finally(() => {
              setSubmitting(false);
            });
          }}
        >
          {({
              values,
              touched,
              errors,
              dirty,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
              handleReset
            }) => (
            <form onSubmit={handleSubmit}>
              <TextField
                autoFocus
                error={Boolean(touched.title && errors.title)}
                helperText={touched.title && errors.title}
                onChange={handleChange}
                margin='dense'
                name='title'
                label='Instance Name'
                value={values.title}
                fullWidth
                required
                variant='standard'
              />
              <TextField
                error={Boolean(touched.description && errors.description)}
                helperText={touched.description && errors.description}
                onChange={handleChange}
                margin='dense'
                name='description'
                label='description'
                value={values.description}
                fullWidth
                variant='standard'
              />
              <TextField
                fullWidth
                label='用户'
                name='player'
                onChange={handleChange}
                required
                select
                margin='dense'
                SelectProps={{ native: true }}
                value={values.player}
                variant='standard'
              >
                {data.users.map((user) => (
                  <option
                    key={user.id}
                    value={user.id}
                  >
                    {user.id}
                  </option>
                ))}
              </TextField>
              <TextField
                fullWidth
                label='运行时'
                name='executor'
                onChange={handleChange}
                required
                select
                margin='dense'
                SelectProps={{ native: true }}
                value={values.executor}
                variant='standard'
              >
                {data.executors.map((executor) => (
                  <option
                    key={executor.id}
                    value={executor.id}
                  >
                    {executor.addr}
                  </option>
                ))}
              </TextField>
              <DialogActions>
                <Button onClick={props.onClose} color='primary'>
                  取消
                </Button>
                <Button type='submit' disabled={isSubmitting} color='primary'>
                  创建
                </Button>
              </DialogActions>
            </form>
          )}
        </Formik>
      </DialogContent>
    </Dialog>
  );
}
