import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  List,
  ListItemAvatar,
  Avatar,
  Button,
  Typography,
  Box,
} from '@mui/material';
import styled from 'styled-components';

// MUI Icons
import MenuIcon from '@mui/icons-material/Menu'; // Hamburger Icon
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'; // Hamburger Close Icon
import GroupsIcon from '@mui/icons-material/Groups'; // Manage users
import HistoryIcon from '@mui/icons-material/History'; // My order history
import FastfoodIcon from '@mui/icons-material/Fastfood'; // Categories & Items
import ManageHistoryIcon from '@mui/icons-material/ManageHistory'; // Manage history
import LogoutIcon from '@mui/icons-material/Logout'; // Logout
import SettingsIcon from '@mui/icons-material/Settings'; // Setting
// MUI Icons
import { getRoutesOfAuthUser, routes } from '../../utils/PermissionInfo';
import { clearSession, selectAuthUser } from '../../redux/slice/sessionSlice';

// Styled Component
const SidebarContainer = styled(Box)`
  position: fixed;
  top: 0px;
  left: 0px;
  background: linear-gradient(to bottom, #614385, #516395);
  min-width: ${(props: any) => (props.$minimize ? '100px' : '300px')};
  max-width: ${(props: any) => (props.$minimize ? '100px' : '300px')};
  height: 100vh;
  z-index: 3;
  transition: all 200ms;
`;

const StyledLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: ${(props: any): string => (props.small ? '10px' : '10px')};
  padding: ${(props: any): string => (props.small ? '5px' : '5px')};
  width: 100%;
  text-decoration: none;
  background: ${(props: any): string =>
    props.selected ? 'rgb(255 255 255 / 20%)' : 'none'};
  margin-top: 5px;
  color: black;
  border-radius: 5px;
  &:hover {
    background: ${(props: any): string =>
      props.selected
        ? 'rgb(255 255 255 / 50%)'
        : props.type === 'bottom'
        ? '#E5E5E5'
        : 'rgb(255 255 255 / 20%)'};
  }
  &:active {
    background: #bfbcbc;
  }
`;
const StyledLogoutButton = styled(Button)`
  display: flex !important;
  align-items: center !important;
  justify-content: start !important;
  gap: 10px !important;
  padding: 15px 20px !important;
  width: 100% !important;
  margin-top: 5px !important;
  color: black !important;
  border-radius: 5px;
  &:hover {
    background: rgb(255 255 255 / 10%) !important;
  }
  &:active {
    background: #bfbcbc;
  }
`;

const UserInfo = styled(Box)`
  width: 100%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const HamburgerBox = styled(Box)`
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  padding: 5px;
  color: #03a9f4;
  background: rgb(0 0 0 / 50%);
  border-radius: 50px;
  cursor: pointer;
  &:hover {
    background: rgb(0 0 0 / 20%);
  }
  &:active {
    background: rgb(0 0 0 / 90%);
  }
`;
// Styled Component

// Sidebar Data
type sidebarDataType = {
  link: string;
  name: string;
  icon: JSX.Element;
};
const sidebarData: Array<sidebarDataType> = [
  {
    link: routes.MY_ORDERS,
    name: 'My Order History',
    icon: <HistoryIcon />,
  },
  {
    link: routes.MANAGE_USERS,
    name: 'Manage Users',
    icon: <GroupsIcon />,
  },
  {
    link: routes.CATEGORIES_AND_ITEMS,
    name: 'Categories & Items',
    icon: <FastfoodIcon />,
  },
  {
    link: routes.ORDER_HISTORY,
    name: 'Order History',
    icon: <ManageHistoryIcon />,
  },
  {
    link: routes.SETTINGS,
    name: 'Settings',
    icon: <SettingsIcon />,
  },
];
// Sidebar Data

/**
 * Returns navigation list items
 * @param {label: string, link: string, path:string, icon: any}
 * @returns JSX.Elemnet custom navigation item
 */
const CustomListItem = ({
  label,
  link,
  path,
  icon,
  minimize,
}: {
  label: string;
  link: string;
  path: string;
  icon: any;
  minimize: boolean;
}) => {
  return (
    <StyledLink to={link} selected={path === link} title={label}>
      <ListItemAvatar>
        <Avatar sx={{ color: 'white', background: 'rgb(255 255 255 / 10%)' }}>
          {icon}
        </Avatar>
      </ListItemAvatar>
      {!minimize && (
        <Typography
          sx={{ fontSize: '16px', fontWeight: '400', color: 'white' }}
        >
          {label}
        </Typography>
      )}
    </StyledLink>
  );
};

/**
 * Returns JSX.Element that cotains user session handeling options
 * @params none
 * @returns JSX.Element contains user session handeling options
 */
const BottomSection = ({ minimize }: { minimize: boolean }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleOnLogout = () => {
    dispatch(clearSession({}));
    navigate('/login');
  };
  return (
    <UserInfo>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '2px',
          width: '100%',
        }}
      >
        <StyledLogoutButton onClick={handleOnLogout} title={'Logout'}>
          <LogoutIcon style={{ color: 'white' }} />
          {!minimize && (
            <Typography component="span" style={{ color: 'white' }}>
              Log out
            </Typography>
          )}
        </StyledLogoutButton>
      </Box>
    </UserInfo>
  );
};

/**
 * Returns Sidebar component, which is used for navigation and is present throughout the application
 * after the user logs in to the application
 *
 * @params - none
 * @returns JSX.Element Sidebar that is used for navigation
 */
const Sidebar = ({
  minimize,
  setMinimize,
}: {
  minimize: boolean;
  setMinimize: (value: any) => void;
}) => {
  const [path, setPath] = useState('');
  const location = useLocation();
  const user = useSelector(selectAuthUser);
  const userPages = getRoutesOfAuthUser(user.roles);

  const handleMinimize = () => {
    setMinimize((state: boolean) => !state);
  };

  useEffect(() => {
    setPath(location.pathname);
  }, [location.pathname]);

  /*  $minimize => Use it only on components that are not react components ( HTML elements or mui/styled-components ).
      Only use it on components that can send the otherwise --minimize-- property to the DOM.
  */
  return (
    <SidebarContainer $minimize={minimize}>
      <Box
        sx={{
          padding: '50px 10px 5px 10px',
          display: 'flex',
          flexGrow: 1,
          flexDirection: 'column',
          height: '100%',
          gap: '20px',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <HamburgerBox onClick={handleMinimize}>
          {minimize ? <ArrowForwardIosIcon /> : <MenuIcon />}
        </HamburgerBox>
        {/* Top Section */}
        <Box
          sx={{
            display: 'flex',
            width: '100%',
            flexDirection: 'column',
            gap: '30px',
            alignItems: 'center',
          }}
        >
          {/*Heading*/}
          <Typography variant="h5" component="span" sx={{ color: 'white' }}>
            {minimize ? 'Admin' : 'Admin Portal'}
          </Typography>
          {/*Navigation Options*/}
          <List sx={{ width: '100%', padding: '0 10px' }}>
            {sidebarData
              .filter((data: sidebarDataType) => {
                return userPages.includes(data.link);
              })
              .map((data: sidebarDataType, index: number) => (
                <React.Fragment key={index}>
                  <CustomListItem
                    link={data.link}
                    path={path}
                    icon={data.icon}
                    label={data.name}
                    minimize={minimize}
                  />
                </React.Fragment>
              ))}
          </List>
        </Box>
        {/*Bottom Section*/}
        <BottomSection minimize={minimize} />
      </Box>
    </SidebarContainer>
  );
};

export default Sidebar;
