import { Helmet } from 'react-helmet';
import { Box, Container, Grid, Pagination } from '@material-ui/core';
import ProductListToolbar from 'src/components/product/ProductListToolbar';
import StationCard from 'src/components/product/StationCard';
import { gql } from '@apollo/client/core';
import { useQuery } from '@apollo/client';
import { LIST_ALL_STATION } from '../mixins/game/schema';

const StationList = () => {
  const {loading, error, data} = useQuery(LIST_ALL_STATION);

  if (loading) return "loading";
  if (error) return error;

  return <>
    <Helmet>
      <title>车站 | Material Kit</title>
    </Helmet>
    <Box
      sx={{
        backgroundColor: 'background.default',
        minHeight: '100%',
        py: 3
      }}
    >
      <Container maxWidth={false}>
        <ProductListToolbar />
        <Box sx={{ pt: 3 }}>
          <Grid
            container
            spacing={3}
          >
            {data.stations.map((station) => (
              <Grid
                item
                key={station.id}
                lg={4}
                md={6}
                xs={12}
              >
                <StationCard station={station} />
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            pt: 3
          }}
        >
          <Pagination
            color='primary'
            count={3}
            size='small'
          />
        </Box>
      </Container>
    </Box>
  </>;
};

export default StationList;
