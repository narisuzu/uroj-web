import { Navigate } from 'react-router-dom';
import DashboardLayout from 'src/components/DashboardLayout';
import MainLayout from 'src/components/MainLayout';
import Account from 'src/pages/Account';
import CustomerList from 'src/pages/CustomerList';
import Dashboard from 'src/pages/Dashboard';
import Login from 'src/pages/Login';
import NotFound from 'src/pages/NotFound';
import StationList from 'src/pages/StationList';
import ExecutorList from 'src/pages/ExecutorList';

import Register from 'src/pages/Register';
import Settings from 'src/pages/Settings';
import InstanceLayout from './components/InstanceStage';
import NewStation from './pages/NewStation';
import StationDetails from './pages/StationDetails';
import NewExecutor from './pages/NewExecutor';

const routes = [
  {
    path: 'app',
    element: <DashboardLayout />,
    children: [
      { path: 'account', element: <Account /> },
      { path: 'customers', element: <CustomerList /> },
      { path: 'executors', element: <ExecutorList /> },
      { path: 'new_station', element: <NewStation /> },
      { path: 'new_executor', element: <NewExecutor /> },
      { path: 'station/:id', element: <StationDetails/>},
      { path: 'dashboard', element: <Dashboard /> },
      { path: 'products', element: <StationList /> },
      { path: 'settings', element: <Settings /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: '/',
    element: <MainLayout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'register', element: <Register /> },
      { path: '404', element: <NotFound /> },
      { path: '/', element: <Navigate to="/app/dashboard" /> },
      { path: '*', element: <Navigate to="/404" /> }
    ]
  },
  {
    path: 'instance/:id',
    element: <InstanceLayout />,
  }
];

export default routes;
