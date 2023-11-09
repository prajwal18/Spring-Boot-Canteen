import { useEffect, useState } from 'react';
import {
  Box,
  Stack,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
// ICONS
import NorthIcon from '@mui/icons-material/North';
import SouthIcon from '@mui/icons-material/South';
// ICONS
import { AppDispatch } from '../../redux/store';

type TableHeaderDataType = Array<{
  icon?: JSX.Element;
  label: String;
  sort?: {
    by: string;
    action: any;
    sliceSort: any;
  };
}>;

interface ICustomTableHeader {
  includeSN: boolean;
  headerData: TableHeaderDataType;
}

type SortType = {
  by: string;
  order: string;
};

const SortComponent = ({
  name,
  action,
  selectCurrentSort,
}: {
  name: string;
  action: (value: any) => any;
  selectCurrentSort: any;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [order, setOrder] = useState<null | string>(null);
  const currentSort: SortType = useSelector(selectCurrentSort);
  useEffect(() => {
    if (currentSort.by === name) {
      setOrder(currentSort.order);
    }
  }, [currentSort]);

  const sortAsc = () => {
    const sort = { by: name, order: 'asc' };
    dispatch(action(sort));
  };
  const sortDesc = () => {
    const sort = { by: name, order: 'desc' };
    dispatch(action(sort));
  };

  return (
    <Stack direction="row" sx={{ gap: '4px' }}>
      <Box title="Ascending">
        <NorthIcon
          onClick={sortAsc}
          sx={{
            color:
              order === 'asc' && name === currentSort.by ? 'blue' : 'black',
            cursor: 'pointer',
          }}
        />
      </Box>
      <Box title="Descending">
        <SouthIcon
          onClick={sortDesc}
          sx={{
            color:
              order === 'desc' && name === currentSort.by ? 'blue' : 'black',
            cursor: 'pointer',
          }}
        />
      </Box>
    </Stack>
  );
};

const CustomTableHeader = ({ includeSN, headerData }: ICustomTableHeader) => {
  return (
    <TableHead>
      <TableRow>
        {includeSN && (
          <TableCell>
            <Typography>S.N</Typography>
          </TableCell>
        )}
        {headerData.map((item, index) => (
          <TableCell key={`table-header-${index}-${item.label}`}>
            <Stack direction="row" gap={1}>
              {item?.icon && item.icon}
              <Typography>{item.label}</Typography>
              {item?.sort && (
                <SortComponent
                  name={item.sort.by}
                  action={item.sort.action}
                  selectCurrentSort={item.sort.sliceSort}
                />
              )}
            </Stack>
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
};

export default CustomTableHeader;
