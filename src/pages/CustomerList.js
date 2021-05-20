import { Helmet } from 'react-helmet';
import { Box, Container } from '@material-ui/core';
import CustomerListResults from 'src/components/customer/CustomerListResults';
import CustomerListToolbar from 'src/components/customer/CustomerListToolbar';
import { useQuery } from '@apollo/client';
import { LIST_ALL_USERS } from '../mixins/game/schema';

const CustomerList = () => {
  const { loading, error, data } = useQuery(LIST_ALL_USERS);
  if (loading) return 'loading';
  if (error) return error;

  return <>
    <Helmet>
      <title>用户 | Material Kit</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <CustomerListToolbar />
        <Box sx={{ pt: 3 }}>
          <CustomerListResults customers={data.users} />
        </Box>
      </Container>
    </Box>
  </>;
};

export default CustomerList;
