import React, { FC, useEffect, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Fab,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { ContainerBox } from '../../components/layout/Layout';
import CustomSelect from '../../components/form/CustomSelect';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch } from '../../redux/store';
import {
  fetchCategoriesDD,
  selectCategoriesDD,
} from '../../redux/slice/categorySlice';

// ICONS
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { GreyBtn } from '../../components/styled-components/Button';
import { ItemType } from '../../redux/slice/itemSlice';
import LoginOrContinueBrowsing from '../../components/modals/LoginOrContinueBrowsing';
import { selectIsLoggedIn } from '../../redux/slice/sessionSlice';
import {
  addItemToCart,
  fetchCategoriesWithItems,
  selectCategoriesWithItems,
  selectMakeOrderCategory,
  selectMakeOrderSearchTerm,
  selectMakeOrderSort,
  selectOrder,
  setMakeOrderCategory,
  setMakeOrderSearchTerm,
  setMakeOrderSort,
} from '../../redux/slice/makeOrderSlice';
import CartComponent from './CartComponent';
// ICONS

// Awesome Shade of Orange #FB8239

// ORDER SORT Options
const itemSortOptionDD = [
  { id: 1, name: 'Name ASC', sort: { by: 'name', order: 'asc' } },
  { id: 2, name: 'Name DESC', sort: { by: 'name', order: 'desc' } },
  { id: 3, name: 'Price ASC', sort: { by: 'price', order: 'asc' } },
  { id: 4, name: 'Price DESC', sort: { by: 'price', order: 'desc' } },
];
const allCategory = { id: 0, name: 'All' };
// ORDER SORT Options

const Order = () => {
  const dispatch = useDispatch<AppDispatch>();
  const categoryDD = useSelector(selectCategoriesDD);
  const category = useSelector(selectMakeOrderCategory);
  const sort = useSelector(selectMakeOrderSort);
  const searchTerm = useSelector(selectMakeOrderSearchTerm);

  const categoriesWithItems = useSelector(selectCategoriesWithItems);

  // Select Components & Filter by searchTerm
  const handleCategoryChange = (e: any) => {
    dispatch(setMakeOrderCategory(e.target.value));
  };
  const handleSortChange = (e: any) => {
    let sortObj = itemSortOptionDD.filter(
      (so: any) => so.id === e.target.value,
    )[0];
    dispatch(setMakeOrderSort({ id: e.target.value, ...sortObj.sort }));
  };
  const handleSearchTermChange = (e: any) => {
    dispatch(setMakeOrderSearchTerm(e.target.value));
  };
  // Select Components & Filter by searchTerm

  useEffect(() => {
    dispatch(fetchCategoriesDD());
  }, [dispatch]);

  useEffect(() => {
    if (categoryDD) {
      dispatch(fetchCategoriesWithItems({}));
    }
  }, [dispatch, categoryDD, category, sort, searchTerm]);
  return (
    <>
      <ContainerBox>
        <BannerImage />
        <Stack
          direction="row"
          justifyContent="center"
          sx={{ width: '100%', px: 2 }}
        >
          <Box sx={{ width: '100%', maxWidth: '1200px', mb: '100px' }}>
            <Typography variant="h5" mb={2} ml={1}>
              Menu
            </Typography>
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              gap={3}
              mb={8}
            >
              <TextField
                label="Search"
                value={searchTerm}
                onChange={handleSearchTermChange}
                fullWidth
              />
              <CustomSelect
                label="Category"
                id="search-category"
                value={category}
                options={
                  categoryDD ? [...categoryDD, allCategory] : [allCategory]
                }
                handleChange={handleCategoryChange}
              />
              <CustomSelect
                label="Sort By"
                id="sort-by-select"
                value={sort.id}
                options={itemSortOptionDD}
                handleChange={handleSortChange}
              />
            </Stack>

            <Stack spacing={6}>
              {categoriesWithItems &&
                categoriesWithItems.map((catNItem: any, index: number) => (
                  <Box key={index}>
                    <Box mb={2}>
                      <Typography variant="h5" mb={1} ml={1}>
                        {catNItem.name}
                      </Typography>
                      <Divider />
                    </Box>
                    {catNItem?.items && <ItemList items={catNItem.items} />}
                    <Divider />
                  </Box>
                ))}
            </Stack>
          </Box>
        </Stack>
      </ContainerBox>
      <ViewCartFAB />
    </>
  );
};

interface IITemList {
  items: Array<ItemType>;
}
const ItemList: FC<IITemList> = ({ items }) => {
  return (
    <Grid container spacing={2} mb={1}>
      {items.map((item: any) => (
        <Grid item xs={4} key={item.id}>
          <ItemComponent item={item} />
        </Grid>
      ))}
    </Grid>
  );
};

const ItemComponent = ({ item }: { item: ItemType | any }) => {
  return (
    <Stack spacing={2}>
      <img
        src={item.photoURL}
        alt={item.name}
        style={{ width: '100%', height: '250px', objectFit: 'cover' }}
      />
      <Typography variant="h6">{item.name}</Typography>
      <Typography>{item.description}</Typography>
      <Typography
        variant="h6"
        style={{ fontWeight: '600', color: 'rgb(0,100,255)' }}
      >
        $ {item.price}
      </Typography>
      <AddToCartComponent item={item} />
    </Stack>
  );
};

// View Cart Component - Floating Action Button
const ViewCartFAB = () => {
  const order = useSelector(selectOrder);
  const [open, setOpen] = useState(false);
  const toggleOpen = () => {
    setOpen(!open);
  };
  const itemNum = useMemo(() => {
    if (order) {
      let num = order.items.length;
      return num;
    }
    return 0;
  }, [order]);
  return (
    <>
      <Box sx={{ position: 'fixed', bottom: '50px', right: '50px' }}>
        <Fab
          title={`${itemNum} in the cart`}
          sx={{ position: 'relative', padding: '35px' }}
          color="success"
          onClick={toggleOpen}
        >
          <ShoppingCartIcon fontSize="large" />
          <Box
            sx={{
              height: '20px',
              width: '20px',
              position: 'absolute',
              top: '8px',
              right: '15px',
              borderRadius: '50%',
              fontSize: '12px',
              fontWeight: '700',
              color: 'white',
              background: 'red',
            }}
          >
            {itemNum}
          </Box>
        </Fab>
      </Box>
      {open && (
        <CartComponent
          handleClose={() => {
            setOpen(false);
          }}
        />
      )}
    </>
  );
};

// Done - Completed
const AddToCartComponent = ({ item }: { item: ItemType | any }) => {
  // -- Controls cart item count --
  const [count, setCount] = useState(1);
  const increment = () => {
    setCount(count + 1);
  };
  const decrement = () => {
    if (count <= 1) {
      setCount(1);
    } else {
      setCount(count - 1);
    }
  };

  // -- Controls cart item count --
  const dispatch = useDispatch();
  const order = useSelector(selectOrder);
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const [openModal, setOpenModal] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handleAddToCart = () => {
    console.log(isLoggedIn);
    if (isLoggedIn) {
      let orderItem = {
        id: item.id,
        name: item.name,
        price: item.price,
        photoURL: item.photoURL,
      };
      dispatch(addItemToCart(orderItem));
    } else {
      setOpenModal(true);
    }
  };

  useEffect(() => {
    let tempIsAdded = false;
    if (order) {
      order.items.forEach((data: any) => {
        if (data.id === item.id) {
          tempIsAdded = true;
        }
      });
    }
    setIsAdded(tempIsAdded);
  }, [order, item]);

  return (
    <>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="flex-start"
        gap={3}
      >
        <Stack direction="row" sx={{ maxWidth: '200px' }}>
          <GreyBtn
            variant="outlined"
            sx={{ borderRadius: '0px', justifyContent: 'center !important' }}
            onClick={increment}
          >
            +
          </GreyBtn>
          <Box sx={{ border: '1px solid grey', px: 3, py: 2, flex: 1 }}>
            {count}
          </Box>
          <GreyBtn
            variant="outlined"
            sx={{ borderRadius: '0px', justifyContent: 'center !important' }}
            onClick={decrement}
          >
            -
          </GreyBtn>
        </Stack>
        <Button
          variant="contained"
          sx={{
            color: 'white',
            background: isAdded ? 'rgb(50,200,50)' : 'rgba(255,0,0,0.5)',
            '&:hover': {
              background: isAdded ? 'rgb(0,220,0)' : 'rgba(255,0,0,0.8)',
            },
          }}
          onClick={handleAddToCart}
        >
          <ShoppingCartIcon />
        </Button>
      </Stack>
      {openModal && (
        <LoginOrContinueBrowsing
          open={openModal}
          handleClose={handleCloseModal}
        />
      )}
    </>
  );
};

// Completed - Static Component
const BannerImage = () => {
  return (
    <Stack
      direction="row"
      justifyContent="center"
      sx={{ width: '100%', background: '#FB8239', marginBottom: '100px' }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ maxWidth: '1200px', width: '100%' }}
      >
        <Box>
          <Typography variant="h3" sx={{ color: 'white' }} mb={2} ml={1}>
            Order Fast. Delivered Fresh
          </Typography>
          <Typography
            variant="h5"
            sx={{ color: 'rgba(255,255,255,0.5)', fontWeight: '700' }}
            ml={1}
          >
            Gourme Recipies
          </Typography>
        </Box>
        <img
          src={
            'https://files.jotform.com/jufs/ugurg/form_files/Order-Food.63889d6e35b188.28207191.png?md5=blHMiQ7ZcCrTIn4W5h0RvA&expires=1699559946'
          }
          style={{ width: 'auto', height: '400px', objectFit: 'cover' }}
          alt="Order Fast. Delivered Fresh"
        />
      </Stack>
    </Stack>
  );
};

export default Order;
