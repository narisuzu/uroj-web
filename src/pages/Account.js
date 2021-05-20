import { Helmet } from 'react-helmet';
import { Box, Container, Grid } from '@material-ui/core';
import AccountProfile from 'src/components/account/AccountProfile';
import AccountProfileDetails from 'src/components/account/AccountProfileDetails';
import { useQuery } from '@apollo/client';
import { QUERY_ME_DETAIL } from '../mixins/game/schema';

const Account = () => {

  const { loading, error, data } = useQuery(QUERY_ME_DETAIL);

  if (loading) return 'loading';
  if (error) return error;
  const user = {
    uid: data.me.id,
    email: data.me.email,
    role: data.me.role,
    class: data.me.class,
    dateJoined: data.me.dateJoined,
    isActive: data.me.isActive,
    avatar: '/static/images/avatars/avatar_6.png'
  };

  return <>
    <Helmet>
      <title>Account | Material Kit</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth='lg'>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            lg={4}
            md={6}
            xs={12}
          >
            <AccountProfile user={user} />
          </Grid>
          <Grid
            item
            lg={8}
            md={6}
            xs={12}
          >
            <AccountProfileDetails user={user} />
          </Grid>
        </Grid>
      </Container>
    </Box>
  </>;
};

export default Account;
