import React, { useEffect, useState } from 'react';
import { Stack, Box, Typography } from '@mui/material';
import { PageTopic } from '../components/styled-components/Container';
import { GreyBtn } from '../components/styled-components/Button';

// ICONS
import PersonIcon from '@mui/icons-material/Person';
import SettingsIcon from '@mui/icons-material/Settings';
// ICONS
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../redux/store';
import { fetchSelectedUser } from '../redux/slice/userSlice';
import ViewUserProfile from '../components/modals/ViewUserProfile';
import ChangePassword from '../components/modals/ChangePassword';

const SettingsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [openProfile, setOpenProfile] = useState(false);
  const [openCP, setOpenCP] = useState(false);
  const handleOpenCP = () => {
    setOpenCP(true);
  };
  const handleCloseCP = () => {
    setOpenCP(false);
  };
  const handleOpenProfile = () => {
    setOpenProfile(true);
  };
  const handleCloseProfile = () => {
    setOpenProfile(false);
  };

  useEffect(() => {
    dispatch(fetchSelectedUser({}));
  }, [dispatch]);

  return (
    <>
      <PageTopic>Settings</PageTopic>
      <Box
        mt={3}
        sx={{
          width: '100%',
          height:"100%",
          minHeight:"500px",
          maxWidth: '1200px',
          backgroundColor: 'rgba(255,255,255,0.5)',
          p: 2,
        }}
      >
        <Stack direction="row" gap={4}>
          <GreyBtn variant="outlined" sx={{ p: 2 }} onClick={handleOpenProfile}>
            <PersonIcon />
            <Typography>View Profile</Typography>
          </GreyBtn>
          <GreyBtn variant="outlined" sx={{ p: 2 }} onClick={handleOpenCP}>
            <SettingsIcon />
            <Typography>Change Password</Typography>
          </GreyBtn>
        </Stack>
      </Box>
      {openProfile && (
        <ViewUserProfile open={openProfile} handleClose={handleCloseProfile} />
      )}
      {openCP && <ChangePassword open={openCP} handleClose={handleCloseCP} />}
    </>
  );
};

export default SettingsPage;
