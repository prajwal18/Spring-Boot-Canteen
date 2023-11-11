import { StatusCodes } from 'http-status-codes';
import endpoints from '../utils/endpoints';
import { jwtAxios } from '../utils/jwtAxios';
import { OrderPaginationFilterType } from '../redux/slice/orderSlice';
import { toast } from 'react-toastify';

export type AddEditOrderType = {
  owner: number | null;
  items: Array<number>;
};

// Generate query string to paginate, sort and filter down your order response.
const generateOrdersQuery = (paginationFilter: OrderPaginationFilterType) => {
  let queryString = '';
  // Attaching page and size
  queryString += `page=${paginationFilter.page}&size=${paginationFilter.size}`;
  // Attaching sort
  queryString += `&sort=${paginationFilter.sort.by},${paginationFilter.sort.order}`;
  // Attaching timerange
  if (paginationFilter.timerange) {
    queryString += `&timerange=${paginationFilter.timerange}`;
  }
  // Attaching SearchTerm
  queryString += `&searchTerm=${paginationFilter.searchTerm}`;
  return queryString;
};

export const getAllOrders = (paginationFilter: OrderPaginationFilterType) => {
  const query = generateOrdersQuery(paginationFilter);
  return jwtAxios().get(endpoints.order.fetchAllOrdersFn(query));
};

export const getAllMyOrders = (
  userId: number,
  paginationFilter: OrderPaginationFilterType,
) => {
  const query = generateOrdersQuery(paginationFilter);
  return jwtAxios().get(endpoints.order.fetchMyOrderslFn(userId, query));
};

export const fetchMyOrdersFn = async (args: any, { getState }: any) => {
  const user = getState().session.user;
  const paginationFilter = getState().order.paginationFilter;
  if (user?.id) {
    const { data, status } = await getAllMyOrders(user.id, paginationFilter);
    if (status === StatusCodes.OK) {
      return data;
    }
  }
  throw new Error('Error fetching orders');
};
export const fetchAllOrdersFn = async (args: any, { getState }: any) => {
  const paginationFilter = getState().order.paginationFilter;
  const { data, status } = await getAllOrders(paginationFilter);
  if (status === StatusCodes.OK) {
    return data;
  }
  throw new Error('Error fetching orders');
};

// Delete Order
export const deleteOrderFn = async (args: any, { getState }: any) => {
  const { id, ...rest } = getState().order.selectedOrder;
  const { status } = await jwtAxios().delete(endpoints.order.deleteOrderFn(id));
  try {
    if (status === StatusCodes.NO_CONTENT) {
      return null;
    }
  } catch (error: any) {
    toast.error('Problem deleting order.');
  }
  throw new Error('Error fetching orders');
};

// Edit Order
export const editOrderFn = async (
  order: AddEditOrderType,
  { getState }: any,
) => {
  const { id: orderId } = getState().order.selectedOrder;
  try {
    const { status } = await jwtAxios().put(
      endpoints.order.editOrderFn(orderId),
      order,
    );
    if (status === StatusCodes.NO_CONTENT) {
      toast.success('Order edited successfully');
      return null;
    }
  } catch (error: any) {
    toast.error('Problem editing order.');
  }
  throw new Error('Error editing order');
};

// Create Order
export const createOrderFn = async (args: any, { getState }: any) => {
  try {
    const order = getState().makeOrder.order;
    let authUser = getState().session.user;
    let newOrder: AddEditOrderType = { owner: null, items: [] };
    newOrder.owner = authUser.id; // Adding owner
    order.items.forEach((item: any) => {
      newOrder.items.push(item.id); // Adding items
    });
    // --- Done new order object is created ---
    const { status } = await jwtAxios().post(
      endpoints.order.createOrder,
      newOrder,
    );
    if (status === StatusCodes.CREATED) {
      toast.success('Order created successfully');
      return null;
    }
  } catch (error) {
    toast.error('Problem creating order.');
  }
  throw new Error('Error creating new order.');
};
