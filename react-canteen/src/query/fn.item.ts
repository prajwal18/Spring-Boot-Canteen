import { StatusCodes } from 'http-status-codes';
import endpoints from '../utils/endpoints';
import { jwtAxios } from '../utils/jwtAxios';
import { ItemPaginationFilterType } from '../redux/slice/itemSlice';
import { toast } from 'react-toastify';
import axios from 'axios';

// ADD ITEM TYPE
export type AddEditItemType = {
  name: string;
  photoURL: string;
  description: string;
  price: number;
  category: string;
};
// ADD ITEM TYPE

// Generate query string to paginate, sort and filter down your items response.
const generateItemsQuery = (paginationFilter: ItemPaginationFilterType) => {
  let queryString = '';
  // Attaching page and size
  queryString += `page=${paginationFilter.page}&size=${paginationFilter.size}`;
  // Attaching sort
  queryString += `&sort=${paginationFilter.sort.by},${paginationFilter.sort.order}`;
  // Attaching SearchTerm
  queryString += `&searchTerm=${paginationFilter.searchTerm}`;
  return queryString;
};

export const getAllItems = (paginationFilter: ItemPaginationFilterType) => {
  const query = generateItemsQuery(paginationFilter);
  return jwtAxios().get(endpoints.item.fetchItemsFn(query));
};

export const getCategoryItems = (
  catId: number,
  paginationFilter: ItemPaginationFilterType,
) => {
  const query = generateItemsQuery(paginationFilter);
  return jwtAxios().get(endpoints.item.fetchCategoryItemsFn(catId, query));
};

export const fetchItemsFn = async (args: any, { getState }: any) => {
  const { id } = getState().category.selectedCategory;
  const paginationFilter = getState().item.paginationFilter;
  if (!id) {
    const { data, status } = await getAllItems(paginationFilter);
    if (status === StatusCodes.OK) {
      return data;
    }
  } else {
    const { data, status } = await getCategoryItems(id, paginationFilter);
    if (status === StatusCodes.OK) {
      return data;
    }
  }
  throw new Error('Error fetching items');
};

// Add ITEM
export const addItemFn = async (item: AddEditItemType) => {
  const catId = item.category;
  try {
    const new_Item = JSON.parse(JSON.stringify(item));
    delete new_Item.category;
    const { status } = await jwtAxios().post(
      endpoints.item.addItemFn(catId),
      new_Item,
    );
    if (status === StatusCodes.CREATED) {
      toast.success('Item added successfully');
      return null;
    }
  } catch (error: any) {
    toast.error('Problem creating item.');
  }
  throw new Error('Error creating item');
};

// Edit ITEM
export const editItemFn = async (item: AddEditItemType, { getState }: any) => {
  const { id: itemId } = getState().item.selectedItem;
  try {
    const { status } = await jwtAxios().put(
      endpoints.item.editItemFn(itemId),
      item,
    );
    if (status === StatusCodes.NO_CONTENT) {
      toast.success('Item edited successfully');
      return null;
    }
  } catch (error: any) {
    toast.error('Problem editing item.');
  }
  throw new Error('Error editing item');
};

// Delete ITEM
export const deleteItemFn = async (args: any, { getState }: any) => {
  const { id: itemId, ...rest } = getState().item.selectedItem;
  try {
    const { status } = await jwtAxios().delete(endpoints.item.deleteItemFn(itemId));
    if (status === StatusCodes.NO_CONTENT) {
      toast.success('Item deleted successfully.');
      return null;
    }
  } catch (error: any) {
    toast.error('Cannot delete item.');
  }
  throw new Error('Error deleting item');
};


// Fetch Category Items DD
export const fetchItemsDDFn = async (catId: number) => {
  const { data, status } = await axios.get(endpoints.item.fetchCategoryItemDDFn(catId));
  if (status === StatusCodes.OK) {
    return data;
  }
  throw new Error('Error fetching Items drop down data.');
};
