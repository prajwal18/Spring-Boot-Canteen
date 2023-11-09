import { TablePagination } from '@mui/material';
import { FC } from 'react';

interface ITablePagination {
  page: number;
  setPage: (value: any) => void;
  rowsPerPage: number;
  setRowsPerPage: (value: any) => void;
  total: number;
}

const CustomTablePagination: FC<ITablePagination> = ({
  page,
  setPage,
  rowsPerPage,
  setRowsPerPage,
  total,
}) => {
  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number,
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  return (
    <TablePagination
      sx={{ width: '100%' }}
      component="div"
      count={total}
      page={page}
      onPageChange={handleChangePage}
      rowsPerPageOptions={[1, 5, 10, 20]}
      rowsPerPage={rowsPerPage}
      onRowsPerPageChange={handleChangeRowsPerPage}
    />
  );
};

export default CustomTablePagination;
