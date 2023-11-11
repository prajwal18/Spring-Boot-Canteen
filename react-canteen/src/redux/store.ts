import { configureStore } from '@reduxjs/toolkit';
import sessionReducer from './slice/sessionSlice';
import itemReducer from './slice/itemSlice';
import categoryReducer from './slice/categorySlice';
import orderReducer from './slice/orderSlice';
import userReducer from './slice/userSlice';
import makeOrderReducer from './slice/makeOrderSlice';

const store = configureStore({
  reducer: {
    session: sessionReducer,
    item: itemReducer,
    category: categoryReducer,
    order: orderReducer,
    user: userReducer,
    makeOrder: makeOrderReducer,
  },
});

export default store;
export type AppDispatch = typeof store.dispatch;
