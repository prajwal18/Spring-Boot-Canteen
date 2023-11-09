import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import {
  addCategoryFn,
  deleteCategoryFn,
  editCategoryFn,
  fetchCategoriesDDFn,
  fetchCategoriesFn,
} from '../../query/fn.category';

export type CategoryType = {
  id: number;
  name: string;
  createdOn?: string;
};
export type CategoryDDType = {
  id:number, name: string
}

export type CategoryPaginationFilterType = {
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
  categories: Array<CategoryType> | null;
  categoriesDD: Array<CategoryDDType> | null;
  selectedCategory: CategoryType | null;
  paginationFilter: CategoryPaginationFilterType;
};

const initialState: initialStateType = {
  isLoading: false,
  error: null,
  categories: null,
  categoriesDD: null,
  selectedCategory: { id: 0, name: 'All' },
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

export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  fetchCategoriesFn,
);

export const fetchCategoriesDD = createAsyncThunk(
  'category/fetchCategoriesDD',
  fetchCategoriesDDFn,
);

export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  deleteCategoryFn,
);

export const editCategory = createAsyncThunk(
  'category/editCategory',
  editCategoryFn,
);

export const addCategory = createAsyncThunk(
  'category/addCategory',
  addCategoryFn,
);

const categorySlice = createSlice({
  name: 'category',
  initialState: initialState,
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setCategoriesPage: (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(state.paginationFilter),
      );
      state.paginationFilter.page = action.payload;
      return state;
    },
    setCategoriesPageSize: (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(state.paginationFilter),
      );
      state.paginationFilter.page = 0;
      state.paginationFilter.size = action.payload;
      return state;
    },
    setCategoriesSort: (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(state.paginationFilter),
      );
      state.paginationFilter.page = 0;
      state.paginationFilter.sort = action.payload;
      return state;
    },
    resetCategoriesPaginationFilter: (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(initialState.paginationFilter),
      );
      return state;
    },
    setCategoriesSearchTerm: (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(state.paginationFilter),
      );
      state.paginationFilter.searchTerm = action.payload;
      state.paginationFilter.page = 0;
      return state;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchCategories.pending, (state, action) => {
      state.paginationFilter.total = 0;
      state.isLoading = true;
      state.error = null;
    });
    builder.addCase(fetchCategories.fulfilled, (state, action) => {
      state.categories = action.payload.items;
      state.paginationFilter.total = action.payload.total;
      state.isLoading = false;
    });
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.categories = null;
      state.paginationFilter.total = 0;
      state.error = 'Unable to fetch categories';
      state.isLoading = false;
    });

    // Successfully fetch Categories DD
    builder.addCase(fetchCategoriesDD.fulfilled, (state, action) => {
      state.categoriesDD = action.payload;
    });

    // Add Successful
    builder.addCase(addCategory.fulfilled, (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(state.paginationFilter),
      );
      state.paginationFilter.page = 0;
    });
    // Edit Successful
    builder.addCase(editCategory.fulfilled, (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(state.paginationFilter),
      );
      state.selectedCategory = {id: 0, name: "All"};
    });
    // Delete Successful
    builder.addCase(deleteCategory.fulfilled, (state, action) => {
      state.paginationFilter = JSON.parse(
        JSON.stringify(state.paginationFilter),
      );
      state.paginationFilter.page = 0;
      state.selectedCategory = {id: 0, name: "All"};
    });
  },
});

// Selectors
export const selectCategoryIsLoading = (state: any) => {
  return state.category.isLoading;
};
export const selectCategoryError = (state: any) => {
  return state.category.error;
};
export const selectCategories = (state: any) => {
  return state.category.categories;
};
export const selectCategoriesDD = (state: any) => {
  return state.category.categoriesDD;
};
export const selectSelectedCategory = (state: any) => {
  return state.category.selectedCategory;
};
export const selectCategoriesPage = (state: any) => {
  return state.category.paginationFilter.page;
};
export const selectCategoriesPageSize = (state: any) => {
  return state.category.paginationFilter.size;
};
export const selectCategoriesSort = (state: any) => {
  return state.category.paginationFilter.sort;
};
export const selectTotalCategories = (state: any) => {
  return state.category.paginationFilter.total;
};
export const selectCategoriesSearchterm = (state: any) => {
  return state.category.paginationFilter.searchTerm;
};
// Selectors

export const {
  setSelectedCategory,
  setCategoriesPage,
  setCategoriesPageSize,
  setCategoriesSort,
  resetCategoriesPaginationFilter,
  setCategoriesSearchTerm,
} = categorySlice.actions;

export default categorySlice.reducer;
