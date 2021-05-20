import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Divider,
  Paper,
  Typography
} from '@material-ui/core';
import { Helmet } from 'react-helmet';
import { useParams } from 'react-router-dom';
import { gql, useQuery } from '@apollo/client';
import NewInstanceDialog from '../components/NewInstanceDialog';
import { useState } from 'react';
import NewInstanceBtn from '../components/NewInstanceBtn';
import ReactJson from 'react-json-view';
import moment from 'moment/moment';
import { GET_STATION } from '../mixins/game/schema';

const StationDetails = (props) => {
  const { id } = useParams();
  const [values, setValues] = useState(null);
  const [open, setOpen] = useState(false);
  const { loading, error, data } = useQuery(GET_STATION, {
    variables: {
      id: parseInt(id)
    }
  });

  if (loading) return 'loading';
  if (error) return error;

  return (
    <>
      <Helmet>
        <title>车站信息 | UROJ</title>
      </Helmet>
      <Box
        sx={{
          backgroundColor: 'background.default',
          minHeight: '100%',
          py: 3
        }}
      >
        <NewInstanceDialog id={parseInt(id)} open={open} value={values} onClose={() => setOpen(false)} />
        <Container maxWidth='lg'>
          <Card>
            <CardHeader
              subheader='Station information'
              title='车站信息'
            />
            <Divider />
            <CardContent>
              <Box sx={{ mb: 3 }}>
                <Typography
                  color='textPrimary'
                  variant='h2'
                >
                  {data.station.title}
                </Typography>
              </Box>

              <Typography
                color='textPrimary'
                gutterBottom
                variant='body1'
              >
                {`车站介绍: ${data.station.description}`}
              </Typography>

              <Typography
                color='textPrimary'
                gutterBottom
                variant='body1'
              >
                {`创建时间: ${moment(data.station.created).format('YYYY/MM/DD HH:mm:ss')}`}
              </Typography>

              <Typography
                color='textPrimary'
                gutterBottom
                variant='body1'
              >
                {`修改时间: ${moment(data.station.updated).format('YYYY/MM/DD HH:mm:ss')}`}
              </Typography>

              <Typography
                color='textPrimary'
                gutterBottom
                variant='body1'
              >
                {`作者: ${data.station.authorId}`}
              </Typography>

              <Typography
                color='textPrimary'
                gutterBottom
                variant='body1'
              >
                {`是否为草稿: ${data.station.draft ? '是' : '非'}`}
              </Typography>

              <Typography
                color='textPrimary'
                gutterBottom
                variant='body1'
              >
                车站描述文件:
              </Typography>
              <Paper variant='outlined' style={{ padding: '10px' }}>
                <ReactJson src={JSON.parse(data.station.yaml)} collapsed={1} displayDataTypes={false} />
              </Paper>
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
                  variant='outlined'
                >
                  编辑
                </Button>
                <NewInstanceBtn onExam={() => {
                  setValues({
                    type: 'exam'
                  });
                  setOpen(true);
                }} onTrain={() => {
                  setValues({ type: 'train' });
                  setOpen(true);
                }} />
              </CardActions>
            </Box>
          </Card>
        </Container>
      </Box>
    </>
  );
};

export default StationDetails;
