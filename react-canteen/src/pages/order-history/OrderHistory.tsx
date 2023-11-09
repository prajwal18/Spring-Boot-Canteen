import { useEffect, useState } from 'react';
import { TextField, Stack } from '@mui/material';
import {
  TablePageContainer,
} from '../../components/styled-components/Container';
import { FilterButton } from '../../components/styled-components/Button';
import CustomTablePagination from '../../components/table/CustomTablePagination';
import OrdersTable from '../my-orders/OrdersTable';
import DateRangeComponent from '../../components/form/DateRangeComponent';
import {
  fetchAllOrders,
  resetOrdersPaginationFilter,
  selectOrdersPage,
  selectOrdersPageSize,
  selectOrdersSort,
  selectOrdersTimerange,
  selectOrdersSearchterm,
  selectTotalOrders,
  setOrdersPage,
  setOrdersPageSize,
  setOrdersSearchTerm,
  setOrdersTimerange,
} from '../../redux/slice/orderSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/store';

const OrderHistory = () => {
  const [openFilter, setOpenFilter] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  // Pagination
  const page = useSelector(selectOrdersPage);
  const pageSize = useSelector(selectOrdersPageSize);
  const timerange = useSelector(selectOrdersTimerange);
  const sort = useSelector(selectOrdersSort);
  const total = useSelector(selectTotalOrders);
  const searchTerm = useSelector(selectOrdersSearchterm);

  const setPage = (page: number) => {
    dispatch(setOrdersPage(page));
  };
  const setPageSize = (size: number) => {
    dispatch(setOrdersPageSize(size));
  };
  // Pagination

  const handleSetTimerange = (value: string) => {
    dispatch(setOrdersTimerange(value));
  };

  const handleSearchTermChange = (e: any) => {
    const string = e.target.value;
    dispatch(setOrdersSearchTerm(string));
  }

  // Fetching orders
  useEffect(() => {
    dispatch(resetOrdersPaginationFilter({}));
    setInitialLoad(false);
  }, [dispatch]);

  useEffect(() => {
    if (!initialLoad) {
      dispatch(fetchAllOrders({}));
    }
  }, [dispatch, initialLoad, page, pageSize, searchTerm, timerange, sort]);
  // Fetching orders
  return (
    <>
      <TablePageContainer
        topic="All Orders"
        subTopic="Order History"
        fsChildren={
          <>
            <Stack direction="row" spacing={2}>
              <TextField
                hidden={true}
                label="Search"
                variant="outlined"
                value={searchTerm}
                onChange={handleSearchTermChange}
                sx={{ minWidth: '200px', marginLeft: '20px' }}
              />
              <FilterButton setOpen={setOpenFilter} open={openFilter} />
            </Stack>
          </>
        }
      >
        {openFilter ? (
          <DateRangeComponent handleSubmit={handleSetTimerange} />
        ) : (
          <></>
        )}

        <OrdersTable />
        <CustomTablePagination
          page={page}
          setPage={setPage}
          rowsPerPage={pageSize}
          setRowsPerPage={setPageSize}
          total={total}
        />
      </TablePageContainer>
    </>
  );
};

export default OrderHistory;
