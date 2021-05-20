import { Helmet } from 'react-helmet';
import { Box, Container, Grid } from '@material-ui/core';
import InstancesList from 'src/components/dashboard/InstancesList';
import Sales from 'src/components/dashboard/Sales';

const Dashboard = () => (
  <>
    <Helmet>
      <title>控制台 | Material Kit</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <Grid
          container
          spacing={3}
        >
          <Grid
            item
            xs={12}
          >
            <InstancesList />
          </Grid>

          <Grid
            item
            lg={8}
            md={12}
            xl={9}
            xs={12}
          >
            <Sales />
          </Grid>


        </Grid>
      </Container>
    </Box>
  </>
);

export default Dashboard;
