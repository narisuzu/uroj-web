import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import ExecutorListResults from 'src/components/executor/ExecutorListResults';
import ExecutorListToolbar from 'src/components/executor/ExecutorListToolbar';
import { gql } from '@apollo/client/core';
import { useQuery } from '@apollo/client';
import { GET_EXECUTORS } from '../mixins/game/schema';

const ExecutorList = () => {
    const { loading, error, data } = useQuery(GET_EXECUTORS);
  if (loading) return 'loading';
  if (error) {
    console.log(error);
    return;
  }


  return <>
    <Helmet>
      <title>运行时 | Material Kit</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <ExecutorListToolbar />
        <Box sx={{ pt: 3 }}>
          <ExecutorListResults executors={data.executors} />
        </Box>
      </Container>
    </Box>
  </>;
};

export default ExecutorList;
