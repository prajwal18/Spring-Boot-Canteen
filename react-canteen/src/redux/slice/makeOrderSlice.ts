import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ItemType } from './itemSlice';
import { fetchCategoriesWithItemFn } from '../../query/fn.item';
import { createOrderFn } from '../../query/fn.order';

export type CreateOrderItem = {
  id: number;
  name: string;
  price: number;
  photoURL: string;
};

type initialStateType = {
  order: {
    items: Array<CreateOrderItem>;
  } | null;
  isSubmitting: boolean;
  category: number;
  filter: {
    searchTerm: string;
    sort: {
      id: number;
      by: string;
      order: string;
    };
  };
  categoriesWithItems: Array<{
    name: string;
    items: Array<ItemType>;
  }> | null;
};

const initialState: initialStateType = {
  order: null,
  isSubmitting: false,
  category: 0,
  filter: { searchTerm: '', sort: { id: 1, by: 'name', order: 'asc' } },
  categoriesWithItems: null,
};

// Thunk actions

export const fetchCategoriesWithItems = createAsyncThunk(
  'makeOrder/fetchCategoriesWithItems',
  fetchCategoriesWithItemFn,
);

export const createOrder = createAsyncThunk(
  'makeOrder/createOrder',
  createOrderFn,
);

// Slice
const makeOrderSlice = createSlice({
  name: 'makeOrder',
  initialState: initialState,
  reducers: {
    setMakeOrderCategory: (state, action) => {
      state.category = action.payload;
      return state;
    },
    setMakeOrderSort: (state, action) => {
      state.filter.sort = action.payload;
      return state;
    },
    setMakeOrderSearchTerm: (state, action) => {
      state.filter.searchTerm = action.payload;
      return state;
    },
    setCategoriesWithItems: (state, action) => {
      state.filter.searchTerm = action.payload;
      return state;
    },
    addItemToCart: (state, action) => {
      let order = JSON.parse(JSON.stringify(state.order));
      if (order) {
        let itemIds = order.items.map((i: any) => i.id);
        if (!itemIds.includes(action.payload.id)) {
          order.items.push(action.payload);
        }
      } else {
        order = {};
        order.items = [action.payload];
      }
      state.order = order;
      return state;
    },
    removeItemFromCart: (state, action) => {
      let order = JSON.parse(JSON.stringify(state.order));
      let removeItemId = action.payload;
      order.items = order.items.filter((item: any) => item.id !== removeItemId);
      state.order = order;
      return state;
    },
  },
  extraReducers: (builder) => {
    // Successfully fetched all thecategories
    builder.addCase(fetchCategoriesWithItems.fulfilled, (state, action) => {
      state.categoriesWithItems = action.payload;
    });
    // Successfully processed an order
    builder.addCase(createOrder.pending, (state, action) => {
      state.isSubmitting = true;
    });

    builder.addCase(createOrder.fulfilled, (state, action) => {
      state.order = null;
      state.isSubmitting = false;
    });
    builder.addCase(createOrder.rejected, (state, action) => {
      state.isSubmitting = false;
    });
  },
});

// Selectors
export const selectOrder = (state: any) => {
  return state.makeOrder.order;
};
export const selectMakeOrderIsSubmitting = (state:any) => {
  return state.makeOrder.isSubmitting;
}
export const selectMakeOrderCategory = (state: any) => {
  return state.makeOrder.category;
};
export const selectCategoriesWithItems = (state: any) => {
  return state.makeOrder.categoriesWithItems;
};
export const selectMakeOrderSearchTerm = (state: any) => {
  return state.makeOrder.filter.searchTerm;
};
export const selectMakeOrderSort = (state: any) => {
  return state.makeOrder.filter.sort;
};

export const {
  setMakeOrderCategory,
  setMakeOrderSort,
  setMakeOrderSearchTerm,
  setCategoriesWithItems,
  addItemToCart,
  removeItemFromCart,
} = makeOrderSlice.actions;
export default makeOrderSlice.reducer;
