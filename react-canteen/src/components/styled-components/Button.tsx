import { FC } from 'react';
import { Button, Typography } from '@mui/material';
import styled from '@emotion/styled';

// ICON
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import VisibilityIcon from '@mui/icons-material/Visibility'; // View
import BorderColorIcon from '@mui/icons-material/BorderColor'; // Edit
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined'; // Delete
// ICON

export const AddBtn = styled(Button)({
  display: 'flex',
  padding: '10px 20px',
  color: 'white',
  background: '#3150a1 !important',
  justifyContent: 'space-between',
  alignItems: 'center',
  gap: '20px',
  textTransform: 'uppercase',
  marginRight: '10px',
});

export const RedBtn = styled(Button)({
  color: 'red',
  borderColor: 'red',
  '&:hover': {
    borderColor: 'red',
    background: 'rgba(255,0,0,0.1)',
  },
});

export const GreyBtn = styled(Button)({
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  justifyContent: 'flex-start',
  gap: '20px',
  color: 'grey',
  borderColor: 'grey',
  '&:hover': {
    borderColor: 'grey',
    background: 'rgba(0,0,0,0.1)',
  },
});

export const FilterButton = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (value: any) => void;
}) => {
  const handleOnClick = () => {
    setOpen(!open);
  };
  return (
    <Button
      sx={{
        display: 'flex',
        minHeight: '100%',
        gap: '10px',
        backgroundColor: 'grey',
        '&:hover': {
          backgroundColor: 'black',
        },
      }}
      onClick={handleOnClick}
      variant="contained"
    >
      <Typography>Filter</Typography>
      {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
    </Button>
  );
};

// Table Action Buttons
interface ITableActionButton {
  handleClick: () => void;
}
export const ViewButton: FC<ITableActionButton> = ({ handleClick }) => {
  return (
    <Button variant="contained" color="primary" onClick={handleClick}>
      <VisibilityIcon />
    </Button>
  );
};

export const EditButton: FC<ITableActionButton> = ({ handleClick }) => {
  return (
    <Button variant="contained" color="secondary" onClick={handleClick}>
      <BorderColorIcon />
    </Button>
  );
};

export const DeleteButton: FC<ITableActionButton> = ({ handleClick }) => {
  return (
    <Button variant="contained" color="warning" onClick={handleClick}>
      <DeleteForeverOutlinedIcon />
    </Button>
  );
};
// Table Action Buttons
