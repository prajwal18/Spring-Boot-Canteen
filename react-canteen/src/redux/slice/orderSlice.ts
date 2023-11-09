import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  deleteOrderFn,
  editOrderFn,
  fetchAllOrdersFn,
  fetchMyOrdersFn,
} from '../../query/fn.order';
import { UserType } from './userSlice';

export type OrderItem = {
  id: number;
  name: string;
  photoURL: string;
  description: string;
  price: number;
  category: {
    id: number;
    name: string;
  };
};
export type OrderType = {
  id: number;
  createdOn: string;
  owner: UserType;
  items: Array<OrderItem>;
};

export type OrderPaginationFilterType = {
  page: number;
  size: number;
  sort: {
    by: string;
    order: string;
  };
  timerange: string;
  total: number;
  searchTerm: string;
};

type initialStateType = {
  orders: Array<OrderType> | null;
  selectedOrder: OrderType | null;
  paginationFilter: OrderPaginationFilterType;
  isLoading: boolean;
  error: string | null;
};

const initialState: initialStateType = {
  orders: null,
  selectedOrder: null,
  paginationFilter: {
    page: 0,
    size: 5,
    sort: {
      by: 'createdOn',
      order: 'asc',
    },
    timerange: '',
    total: 0,
    searchTerm: '',
  },
  isLoading: false,
  error: null,
};

// Thunk actions

export const fetchMyOrders = createAsyncThunk(
  'order/fetchMyOrders',
  fetchMyOrdersFn,
);
export const fetchAllOrders = createAsyncThunk(
  'order/fetchOrders',
  fetchAllOrdersFn,
);
export const deleteOrder = createAsyncThunk('order/deleteOrder', deleteOrderFn);
export const editOrder = createAsyncThunk('order/editOrder', editOrderFn);

const orderSlice = createSlice({
  name: 'order',
  initialState: initialState,
  reducers: {
    setSelectedOrder: (state, action) => {
      state.selectedOrder = action.payload;
      return state;
    },
    setOrdersPage: (state, action) => {
      state.paginationFilter.page = action.payload;
      return state;
    },
    setOrdersPageSize: (state, action) => {
      state.paginationFilter.page = 0;
      state.paginationFilter.size = action.payload;
      return state;
    },
    setOrdersSort: (state, action) => {
      const new_state = JSON.parse(JSON.stringify(state));
      new_state.paginationFilter.page = 0;
      new_state.paginationFilter.sort = action.payload;
      return new_state;
    },
    setOrdersTimerange: (state, action) => {
      const new_state = JSON.parse(JSON.stringify(state));
      new_state.paginationFilter.page = 0;
      new_state.paginationFilter.timerange = action.payload;
      return new_state;
    },
    resetOrdersPaginationFilter: (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(initialState.paginationFilter),
      );
      return state;
    },
    setOrdersSearchTerm: (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(state.paginationFilter),
      );
      state.paginationFilter.searchTerm = action.payload;
      state.paginationFilter.page = 0;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMyOrders.pending, (state, action) => {
      state.paginationFilter.total = 0;
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchMyOrders.fulfilled, (state, action) => {
      state.orders = action.payload.items;
      state.paginationFilter.total = action.payload.total;
      state.isLoading = false;
    });
    builder.addCase(fetchMyOrders.rejected, (state, action) => {
      state.orders = null;
      state.paginationFilter.total = 0;
      state.error = 'Unable to fetch orders';
      state.isLoading = false;
    });

    builder.addCase(fetchAllOrders.pending, (state, action) => {
      state.paginationFilter.total = 0;
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchAllOrders.fulfilled, (state, action) => {
      state.orders = action.payload.items;
      state.paginationFilter.total = action.payload.total;
      state.isLoading = false;
    });
    builder.addCase(fetchAllOrders.rejected, (state, action) => {
      state.orders = null;
      state.paginationFilter.total = 0;
      state.error = 'Unable to fetch items';
      state.isLoading = false;
    });

    // Delete Order
    builder.addCase(deleteOrder.fulfilled, (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(state.paginationFilter),
      );
      state.paginationFilter.page = 0;
      state.selectedOrder = null;
    });

    // Edit Order
    builder.addCase(editOrder.fulfilled, (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(state.paginationFilter),
      );
      state.selectedOrder = null;
    });
  },
});

// Selectors
export const selectOrdersIsLoading = (state: any) => {
  return state.order.isLoading;
};
export const selectOrdersError = (state: any) => {
  return state.order.error;
};
export const selectOrders = (state: any) => {
  return state.order.orders;
};
export const selectSelectedOrder = (state: any) => {
  return state.order.selectedOrder;
};
export const selectOrdersPage = (state: any) => {
  return state.order.paginationFilter.page;
};
export const selectOrdersPageSize = (state: any) => {
  return state.order.paginationFilter.size;
};
export const selectOrdersTimerange = (state: any) => {
  return state.order.paginationFilter.size;
};
export const selectOrdersSort = (state: any) => {
  return state.order.paginationFilter.sort;
};
export const selectTotalOrders = (state: any) => {
  return state.order.paginationFilter.total;
};
export const selectOrdersSearchterm = (state: any) => {
  return state.order.paginationFilter.searchTerm;
};
// Selectors

export const {
  setSelectedOrder,
  setOrdersPage,
  setOrdersPageSize,
  setOrdersSort,
  setOrdersTimerange,
  resetOrdersPaginationFilter,
  setOrdersSearchTerm,
} = orderSlice.actions;

export default orderSlice.reducer;
