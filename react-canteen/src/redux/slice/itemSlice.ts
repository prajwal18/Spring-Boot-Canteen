import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addItemFn,
  deleteItemFn,
  editItemFn,
  fetchItemsDDFn,
  fetchItemsFn,
} from '../../query/fn.item';

export type ItemType = {
  id: number;
  name: string;
  photoURL: string;
  description: string;
  price: string;
  createdOn: string;
  updatedOn: string;
  category: {
    id: number;
    name: string;
  };
};

export type ItemDDType = {
  id: number;
  name: string;
  catId: number;
  price: number;
  photoURL: string;
};

export type ItemPaginationFilterType = {
  page: number;
  size: number;
  sort: {
    by: string;
    order: string;
  };
  total: number;
  searchTerm: string;
};

type initialStateType = {
  isLoading: boolean;
  error: string | null;
  items: Array<ItemType> | null;
  itemDD: Array<ItemDDType> | null;
  selectedItem: ItemType | null;
  paginationFilter: ItemPaginationFilterType;
};

const initialState: initialStateType = {
  isLoading: false,
  error: null,
  items: null,
  itemDD: null,
  selectedItem: null,
  paginationFilter: {
    page: 0,
    size: 5,
    sort: {
      by: 'name',
      order: 'asc',
    },
    total: 0,
    searchTerm: '',
  },
};

// Thunk actions

export const fetchItems = createAsyncThunk('item/fetchItems', fetchItemsFn);
export const fetchItemDD = createAsyncThunk('item/fetchItemDD', fetchItemsDDFn);
export const addItem = createAsyncThunk('item/addItem', addItemFn);
export const editItem = createAsyncThunk('item/editItem', editItemFn);
export const deleteItem = createAsyncThunk('item/deleteItem', deleteItemFn);

const itemSlice = createSlice({
  name: 'item',
  initialState: initialState,
  reducers: {
    setSelectedItem: (state, action) => {
      state.selectedItem = action.payload;
      return state;
    },
    setItemsPage: (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(state.paginationFilter),
      );
      state.paginationFilter.page = action.payload;
      return state;
    },
    setItemsPageSize: (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(state.paginationFilter),
      );
      state.paginationFilter.page = 0;
      state.paginationFilter.size = action.payload;
      return state;
    },
    setItemsSort: (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(state.paginationFilter),
      );
      state.paginationFilter.page = 0;
      state.paginationFilter.sort = action.payload;
      return state;
    },
    resetItemsPaginationFilter: (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(initialState.paginationFilter),
      );
      return state;
    },
    setItemsSearchTerm: (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(state.paginationFilter),
      );
      state.paginationFilter.searchTerm = action.payload;
      state.paginationFilter.page = 0;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchItems.pending, (state, action) => {
      state.paginationFilter.total = 0;
      state.items = null;
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchItems.fulfilled, (state, action) => {
      state.items = action.payload.items;
      state.paginationFilter.total = action.payload.total;
      state.isLoading = false;
      state.error = null;
    });
    builder.addCase(fetchItems.rejected, (state, action) => {
      state.paginationFilter.total = 0;
      state.items = null;
      state.error = 'Unable to fetch items';
      state.isLoading = false;
    });

    // Add Successful
    builder.addCase(addItem.fulfilled, (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(state.paginationFilter),
      );
      state.paginationFilter.page = 0;
    });
    // Edit Successful
    builder.addCase(editItem.fulfilled, (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(state.paginationFilter),
      );
      state.selectedItem = null;
    });
    // Delete Successful
    builder.addCase(deleteItem.fulfilled, (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(state.paginationFilter),
      );
      state.paginationFilter.page = 0;
      state.selectedItem = null;
    });
    // Fetch Item DD Successful
    builder.addCase(fetchItemDD.fulfilled, (state, action) => {
      state.itemDD = action.payload;
    });
  },
});

// Selectors
export const selectItemIsLoading = (state: any) => {
  return state.item.isLoading;
};
export const selectItemError = (state: any) => {
  return state.item.error;
};
export const selectItems = (state: any) => {
  return state.item.items;
};
export const selectItemDD = (state: any) => {
  return state.item.itemDD;
};
export const selectSelectedItem = (state: any) => {
  return state.item.selectedItem;
};
export const selectItemsPage = (state: any) => {
  return state.item.paginationFilter.page;
};
export const selectItemsPageSize = (state: any) => {
  return state.item.paginationFilter.size;
};
export const selectItemsSort = (state: any) => {
  return state.item.paginationFilter.sort;
};
export const selectTotalItems = (state: any) => {
  return state.item.paginationFilter.total;
};
export const selectItemsSearchterm = (state: any) => {
  return state.item.paginationFilter.searchTerm;
};
// Selectors
export const {
  setSelectedItem,
  setItemsPage,
  setItemsPageSize,
  setItemsSort,
  resetItemsPaginationFilter,
  setItemsSearchTerm,
} = itemSlice.actions;

export default itemSlice.reducer;
