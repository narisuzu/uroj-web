import { useEffect } from 'react';
import { Link as RouterLink, useLocation, useNavigate } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Avatar, Box, Divider, Drawer, Hidden, List, ListSubheader, Typography } from '@material-ui/core';
import {
  BarChart as BarChartIcon,
  Settings as SettingsIcon,
  ShoppingBag as ShoppingBagIcon,
  User as UserIcon,
  Users as UsersIcon,
  Server as ServerIcon
} from 'react-feather';
import NavItem from './NavItem';
import { gql } from '@apollo/client/core';
import { useQuery } from '@apollo/client';
import { QUERY_ME } from '../mixins/game/schema';

const userItems = [
  {
    href: '/app/dashboard',
    icon: BarChartIcon,
    title: '控制臺'
  },
  {
    href: '/app/products',
    icon: ShoppingBagIcon,
    title: '站場'
  },
  {
    href: '/app/account',
    icon: UserIcon,
    title: '賬戶'
  },
  {
    href: '/app/settings',
    icon: SettingsIcon,
    title: '設定'
  }
  // {
  //   href: '/login',
  //   icon: LockIcon,
  //   title: 'Login'
  // },
  // {
  //   href: '/register',
  //   icon: UserPlusIcon,
  //   title: 'Register'
  // },
  // {
  //   href: '/404',
  //   icon: AlertCircleIcon,
  //   title: 'Error'
  // }
];

const adminItems = [
  {
    href: '/app/customers',
    icon: UsersIcon,
    title: '用戶'
  },
  {
    href: '/app/executors',
    icon: ServerIcon,
    title: '运行时'
  }
];

const DashboardSidebar = ({ onMobileClose, openMobile }) => {
  const location = useLocation();

  const { loading, error, data } = useQuery(QUERY_ME);

  useEffect(() => {
    if (openMobile && onMobileClose) {
      onMobileClose();
    }
  }, [location.pathname]);

  if (loading) return 'loading...';
  if (error) {
    return "ERROR:"+error;
  }

  const user = {
    avatar: '/static/images/avatars/avatar_6.png',
    role: data.me.role,
    name: data.me.id
  };

  const content = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      <Box
        sx={{
          p: 2
        }}
      >
        <Box
          sx={{
            backgroundColor: 'background.default',
            borderRadius: 1,
            alignItems: 'center',
            display: 'flex',
            overflow: 'hidden',
            p: 2
          }}
        >
          <Avatar
            component={RouterLink}
            src={user.avatar}
            sx={{
              cursor: 'pointer',
              width: 48,
              height: 48
            }}
            to='/app/account'
          />
          <Box
            sx={{
              ml: 2
            }}
          >
            <Typography
              variant='h6'
            >
              {user.name}
            </Typography>
            <Typography
              variant='body2'
              color='rgb(107, 119, 140)'
            >
              {user.role}
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider />
      {/* 以下はサイドバーの内容である */}
      <Box sx={{ p: 2 }}>
        <List
          subheader={(
            <ListSubheader
              sx={{
                textTransform: 'uppercase',
                color: 'rgb(23, 43, 77)',
                p: 0
              }}
            >
              User
            </ListSubheader>
          )}
        >
          <List>
            {userItems.map((item) => (
              <NavItem
                href={item.href}
                key={item.title}
                title={item.title}
                icon={item.icon}
              />
            ))}
          </List>
        </List>
      </Box>

      {
        user.role === 'ADMIN' ?
          <Box sx={{ p: 2 }}>
            <List
              subheader={(
                <ListSubheader
                  sx={{
                    textTransform: 'uppercase',
                    color: 'rgb(23, 43, 77)',
                    p: 0
                  }}
                >
                  Admin
                </ListSubheader>
              )}
            >
              <List>
                {adminItems.map((item) => (
                  <NavItem
                    href={item.href}
                    key={item.title}
                    title={item.title}
                    icon={item.icon}
                  />
                ))}
              </List>
            </List>
          </Box>
          : null
      }


      <Box sx={{ flexGrow: 1 }} />
    </Box>
  );

  return (
    <>
      <Hidden lgUp>
        <Drawer
          anchor='left'
          onClose={onMobileClose}
          open={openMobile}
          variant='temporary'
          PaperProps={{
            sx: {
              width: 256
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
      <Hidden lgDown>
        <Drawer
          anchor='left'
          open
          variant='persistent'
          PaperProps={{
            sx: {
              width: 256,
              top: 64,
              height: 'calc(100% - 64px)'
            }
          }}
        >
          {content}
        </Drawer>
      </Hidden>
    </>
  );
};

DashboardSidebar.propTypes = {
  onMobileClose: PropTypes.func,
  openMobile: PropTypes.bool
};

DashboardSidebar.defaultProps = {
  onMobileClose: () => {
  },
  openMobile: false
};

export default DashboardSidebar;
