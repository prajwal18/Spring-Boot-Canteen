import { Box, Typography, Stack } from '@mui/material';
import { styled } from '@mui/system';
import FoodImage1 from '../../assets/images/background.jpeg';

export const MainContentBox = styled(Box)({
  display: "flex",
  flexDirection: "column",
  alignItems:'flex-start',
  gap: "10px",
  background: "white",
  maxWidth: "1200px",
  margin:"25px 0"
});

export const PageTopic = styled(Typography)({
  fontWeight: 700,
  fontSize: '28px',
  lineHeight: '24px',
});

export const PageSubTopic = styled(Typography)({
  fontSize: '20px',
  margin: '20px',
});

export const TableFilterStackContainer = styled(Stack)({
  padding:"0px 20px",
  marginBottom:"15px",
  flexDirection:"row",
  gap:"20px"
})

const TableSearchStackContainer = styled(Box)({
  paddingRight:"10px",
  marginBottom:"20px",
  display:"flex",
  gap:"20px",
  width:"100%",
  justifyContent:"space-between",
  alignItems:"center"
});

export const LoginRegistrationContainer = styled(Box)`
  height: 100vh;
  width: 100vw;
  background-image: url(${FoodImage1});
  background-size: cover;
  position: absolute;
`;



export const TableSearchStack = ({ children }: { children: any }) => {
  return (
    <TableSearchStackContainer>
      {children}
    </TableSearchStackContainer>
  );
};

// --------------- Table Page Container ---------------
export interface ITablePageContainer {
  topic: string;
  subTopic: string;
  fsChildren: JSX.Element;
  children: JSX.Element | Array<JSX.Element>;
}
export const TablePageContainer = ({
  topic,
  subTopic,
  fsChildren,
  children,
}: ITablePageContainer) => {
  return (
    <>
      <PageTopic>{topic}</PageTopic>
      <MainContentBox>
        <PageSubTopic>{subTopic}</PageSubTopic>
        <TableSearchStack>{fsChildren}</TableSearchStack>
        {children}
      </MainContentBox>
    </>
  );
};
// --------------- Table Page Container ---------------
