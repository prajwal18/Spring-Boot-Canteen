import { StatusCodes } from 'http-status-codes';
import endpoints from '../utils/endpoints';
import { jwtAxios } from '../utils/jwtAxios';
import { CategoryPaginationFilterType } from '../redux/slice/categorySlice';
import { toast } from 'react-toastify';
import axios from 'axios';

// Generate query string to paginate, sort and filter down your category response.
const generateCategoriesQuery = (
  paginationFilter: CategoryPaginationFilterType,
) => {
  let queryString = '';
  // Attaching page and size
  queryString += `page=${paginationFilter.page}&size=${paginationFilter.size}`;
  // Attaching sort
  queryString += `&sort=${paginationFilter.sort.by},${paginationFilter.sort.order}`;
  // Attaching timerange
  queryString += `&searchTerm=${paginationFilter.searchTerm}`;
  return queryString;
};

export const getAllCategories = (
  paginationFilter: CategoryPaginationFilterType,
) => {
  const query = generateCategoriesQuery(paginationFilter);
  return jwtAxios().get(endpoints.category.fetchCategoriesFn(query));
};

export const fetchCategoriesFn = async (args: any, { getState }: any) => {
  const paginationFilter = getState().category.paginationFilter;
  const { data, status } = await getAllCategories(paginationFilter);
  if (status === StatusCodes.OK) {
    return data;
  }
  throw new Error('Error fetching categories');
};

export const fetchCategoriesDDFn = async () => {
  try{
    const { data, status } = await axios.get(endpoints.category.fetchCategoriesDD);
    if (status === StatusCodes.OK) {
      return data;
    }
  } catch(error) {
    toast.error("Error fetching categories drop down data");
  }
  throw new Error('Error fetching categories drop down data.');
};

export const deleteCategoryFn = async (args: any, { getState }: any) => {
  const { id, ...rest } = getState().category.selectedCategory;
  try {
    const { status } = await jwtAxios().delete(
      endpoints.category.deleteCategoryFn(id),
    );
    if (status === StatusCodes.NO_CONTENT) {
      return null;
    }
  } catch (error: any) {
    toast.error('Cannot delete category with items.');
  }
  throw new Error('Error deleting category');
};

export const editCategoryFn = async (args: any, { getState }: any) => {
  const category = JSON.parse(JSON.stringify(getState().category.selectedCategory));
  category.name = args.name;
  try {
    const { status } = await jwtAxios().put(
      endpoints.category.editCategoryFn(category.id),
      category,
    );
    if (status === StatusCodes.NO_CONTENT) {
      toast.success("Category added successfully");
      return null;
    }
  } catch (error: any) {
    toast.error('Problem editing category.');
  }
  throw new Error('Error editing category');
};

export const addCategoryFn = async (category: {name:string}) => {
  try {
    const { status } = await jwtAxios().post(
      endpoints.category.addCategory,
      category,
    );
    if (status === StatusCodes.CREATED) {
      toast.success("Category added successfully");
      return null;
    }
  } catch (error: any) {
    toast.error('Problem creating category.');
  }
  throw new Error('Error creating category');
};
