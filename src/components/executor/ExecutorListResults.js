import { useState } from 'react';
import PropTypes from 'prop-types';
import PerfectScrollbar from 'react-perfect-scrollbar';
import {
  Box,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@material-ui/core';

const ExecutorListResults = ({ executors, ...rest }) => {
  const [selectedExecutorIds, setSelectedExecutorIds] = useState([]);
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(0);

  console.log('relaod');
  const handleLimitChange = (event) => {
    setLimit(event.target.value);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Card {...rest}>
      <PerfectScrollbar>
        <Box sx={{ minWidth: 1050 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  ID
                </TableCell>
                <TableCell>
                  地址
                </TableCell>
                <TableCell>
                  延迟
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {executors.slice(0, limit).map(executor => (
                <TableRow
                  hover
                  key={executor.id}
                  selected={selectedExecutorIds.indexOf(executor.id) !== -1}
                >
                  <TableCell>
                    <Box
                      sx={{
                        alignItems: 'center',
                        display: 'flex'
                      }}
                    >
                      <Typography
                        color='textPrimary'
                        variant='body1'
                      >
                        {executor.id}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {executor.addr}
                  </TableCell>
                  <TableCell>
                    {
                      '1ms'
                    }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Box>
      </PerfectScrollbar>
      <TablePagination
        component='div'
        count={executors.length}
        onPageChange={handlePageChange}
        onRowsPerPageChange={handleLimitChange}
        page={page}
        rowsPerPage={limit}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Card>
  );
};

ExecutorListResults.propTypes = {
  executors: PropTypes.array.isRequired
};

export default ExecutorListResults;
