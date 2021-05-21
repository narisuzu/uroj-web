import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { styled } from '@material-ui/core';
import DashboardNavbar from './DashboardNavbar';
import DashboardSidebar from './DashboardSidebar';
import { setContext } from '@apollo/client/link/context';
import { ApolloClient, ApolloProvider, createHttpLink, InMemoryCache } from '@apollo/client';
import { useNavigate } from 'react-router';

const DashboardLayoutRoot = styled('div')(
  ({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    display: 'flex',
    height: '100%',
    overflow: 'hidden',
    width: '100%'
  })
);

const DashboardLayoutWrapper = styled('div')(
  ({ theme }) => ({
    display: 'flex',
    flex: '1 1 auto',
    overflow: 'hidden',
    paddingTop: 64,
    [theme.breakpoints.up('lg')]: {
      paddingLeft: 256
    }
  })
);

const DashboardLayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  overflow: 'hidden'
});

const DashboardLayoutContent = styled('div')({
  flex: '1 1 auto',
  height: '100%',
  overflow: 'auto'
});

const DashboardLayout = () => {
  const [isMobileNavOpen, setMobileNavOpen] = useState(false);
  const navigate = useNavigate();

  const authLink = setContext((_, { headers }) => {
    // get the authentication token from local storage if it exists
    const token = localStorage.getItem('token');
    // return the headers to the context so httpLink can read them
    if (!token) {
      navigate('/login', { replace: true });
      return null;
    }
    return {
      headers: {
        ...headers,
        authorization: token ? `Bearer ${token}` : ''
      }
    };
  });

  const httpLink = createHttpLink({
    uri: 'http://uroj.sozr.cn:8001',
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
  });

  return (
    <ApolloProvider client={client}>
      <DashboardLayoutRoot>
        <DashboardNavbar onMobileNavOpen={() => setMobileNavOpen(true)} />
        <DashboardSidebar
          onMobileClose={() => setMobileNavOpen(false)}
          openMobile={isMobileNavOpen}
        />
        <DashboardLayoutWrapper>
          <DashboardLayoutContainer>
            <DashboardLayoutContent>
              <Outlet />
            </DashboardLayoutContent>
          </DashboardLayoutContainer>
        </DashboardLayoutWrapper>
      </DashboardLayoutRoot>
    </ApolloProvider>
  );
};

export default DashboardLayout;
