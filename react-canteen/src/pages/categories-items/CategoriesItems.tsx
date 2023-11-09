import { Stack } from '@mui/material';
import { TablePageContainer } from '../../components/styled-components/Container';
import CategoryTable from './CategoryTable';
import ItemTable from './ItemTable';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import { fetchCategoriesDD } from '../../redux/slice/categorySlice';

const CategoriesItems = () => {
  const dispatch = useDispatch<AppDispatch>();
  dispatch(fetchCategoriesDD());
  return (
    <>
      <TablePageContainer
        topic="All Categories and Items"
        subTopic="Categories and items"
        fsChildren={<></>}
      >
        <Stack
          direction="row"
          gap={4}
          px={2}
          sx={{ width: '100%' }}
          justifyContent={'space-between'}
        >
          <CategoryTable />
          <ItemTable />
        </Stack>
      </TablePageContainer>
    </>
  );
};

export default CategoriesItems;
