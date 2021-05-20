import moment from 'moment';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Button,
  Card,
  CardHeader,
  Chip,
  Divider,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  Tooltip
} from '@material-ui/core';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import PlayArrow from '@material-ui/icons/PlayArrow';
import { gql } from '@apollo/client/core';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';
import { LIST_ALL_INSTANCES } from '../../mixins/game/schema';

const InstancesList = (props) => {
  const navigate = useNavigate();

  const { loading, error, data } = useQuery(LIST_ALL_INSTANCES);
  if (loading) return 'loading';
  if (error) return error;

  return <Card {...props}>
    <CardHeader title='最新实例' />
    <Divider />
    <PerfectScrollbar>
      <Box sx={{ minWidth: 800 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                实例名称
              </TableCell>
              <TableCell>
                用户
              </TableCell>
              <TableCell>
                车站
              </TableCell>
              <TableCell sortDirection='desc'>
                <Tooltip
                  enterDelay={300}
                  title='Sort'
                >
                  <TableSortLabel
                    active
                    direction='desc'
                  >
                    开始时间
                  </TableSortLabel>
                </Tooltip>
              </TableCell>
              <TableCell>
                状态
              </TableCell>
              <TableCell>
                操作
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.instances.map((order) => {
              const now = moment();
              const begin = moment(order.beginAt);
              return <TableRow
                hover
                key={order.id}
              >
                <TableCell>
                  {order.title}
                </TableCell>
                <TableCell>
                  {order.player}
                </TableCell>
                <TableCell>
                  {order.station.title}
                </TableCell>
                <TableCell>
                  {begin.format('MM/DD HH:mm:ss')}
                </TableCell>
                <TableCell>
                  <Chip
                    color='primary'
                    label={order.currState}
                    size='small'
                  />
                </TableCell>
                <TableCell>
                  <IconButton disabled={now.isBefore(begin)} aria-label='运行实例' onClick={() => {
                    localStorage.setItem(order.id, JSON.stringify({ state: order.currState }));
                    navigate('/instance/' + order.id, { state: { uri: order.executor.addr } });
                  }}>
                    <PlayArrow />
                  </IconButton>
                </TableCell>
              </TableRow>;
            })}
          </TableBody>
        </Table>
      </Box>
    </PerfectScrollbar>
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'flex-end',
        p: 2
      }}
    >
      <Button
        color='primary'
        endIcon={<ArrowRightIcon />}
        size='small'
        variant='text'
      >
        查看所有
      </Button>
    </Box>
  </Card>;
};

export default InstancesList;
