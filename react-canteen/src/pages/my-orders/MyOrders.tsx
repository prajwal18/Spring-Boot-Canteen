import { useEffect, useState } from 'react';
import { TablePageContainer } from '../../components/styled-components/Container';
import CustomTablePagination from '../../components/table/CustomTablePagination';
import OrdersTable from './OrdersTable';
import DateRangeComponent from '../../components/form/DateRangeComponent';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import {
  fetchMyOrders,
  resetOrdersPaginationFilter,
  selectOrdersPage,
  selectOrdersPageSize,
  selectOrdersSort,
  selectOrdersTimerange,
  selectTotalOrders,
  setOrdersPage,
  setOrdersPageSize,
  setOrdersTimerange,
} from '../../redux/slice/orderSlice';

const MyOrders = () => {
  const [initialLoad, setInitialLoad] = useState(true);
  const dispatch = useDispatch<AppDispatch>();
  // Pagination
  const page = useSelector(selectOrdersPage);
  const pageSize = useSelector(selectOrdersPageSize);
  const timerange = useSelector(selectOrdersTimerange);
  const sort = useSelector(selectOrdersSort);
  const total = useSelector(selectTotalOrders);

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

  // Fetching orders
  useEffect(() => {
    dispatch(resetOrdersPaginationFilter({}));
    setInitialLoad(false);
  }, [dispatch]);

  useEffect(() => {
    if (!initialLoad) {
      dispatch(fetchMyOrders({}));
    }
    console.log(timerange);
  }, [dispatch, initialLoad, page, pageSize, timerange, sort]);
  // Fetching orders

  return (
    <>
      <TablePageContainer
        topic="My Orders"
        subTopic="My Order History"
        fsChildren={<DateRangeComponent handleSubmit={handleSetTimerange} />}
      >
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

export default MyOrders;
