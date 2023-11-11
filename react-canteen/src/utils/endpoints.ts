export const baseURL = process.env.REACT_APP_BASE_URL;

const endpoints = {
  auth: {
    login: `${baseURL}/login`,
    fetchSession: `${baseURL}/session-info`,
  },
  user: {
    register: `${baseURL}/register`,
    fetchUserDDFn: (query: string) => `${baseURL}/users/dd?${query}`,
    fetchUsersFn: (query: string) => `${baseURL}/users?${query}`,
    fetchUserFn: (userId: number) => `${baseURL}/users/${userId}`,
    addUser: `${baseURL}/users`,
    editUserFn: (userId: number) => `${baseURL}/users/${userId}`,
    deleteUserFn: (userId: number) => `${baseURL}/users/${userId}`,
    changePasswordByAdminFn: (userId: number) =>
      `${baseURL}/users/${userId}/change-password-by-admin`,
    changePasswordByUserFn: (userId: number) =>
      `${baseURL}/users/${userId}/password`,
  },
  order: {
    createOrder: `${baseURL}/orders`,
    fetchMyOrderslFn: (userId: number, query: string) =>
      `${baseURL}/users/${userId}/orders?${query}`,
    fetchAllOrdersFn: (query: string) => `${baseURL}/orders?${query}`,
    deleteOrderFn: (id: number) => `${baseURL}/orders/${id}`,
    editOrderFn: (id:number) => `${baseURL}/orders/${id}`
  },
  category: {
    fetchCategoriesDD: `${baseURL}/categories/dd`,
    fetchCategoriesFn: (query: string) => `${baseURL}/categories?${query}`,
    deleteCategoryFn: (id: number) => `${baseURL}/categories/${id}`,
    editCategoryFn: (id: number) => `${baseURL}/categories/${id}`,
    addCategory: `${baseURL}/categories`,
  },
  item: {
    fetchCategoryItemDDFn: (catId: number) =>
      `${baseURL}/categories/${catId}/items/dd`,
    fetchItemsFn: (query: string) => `${baseURL}/items?${query}`,
    fetchCategoryItemsFn: (catId: number, query: string) =>
      `${baseURL}/categories/${catId}/items?${query}`,
    addItemFn: (catId: number | string) =>
      `${baseURL}/categories/${catId}/items`,
    editItemFn: (itemId: number) => `${baseURL}/items/${itemId}`,
    deleteItemFn: (itemId: number) => `${baseURL}/items/${itemId}`,
  },
};

export default endpoints;
