import { useState } from 'react';
import styled from 'styled-components';
import Box from '@mui/material/Box';
import Sidebar from './Sidebar';
import Router from '../utility/Router';
import useIsLoggedIn from '../../hooks/useIsLoggedIn';

// Styled Component
const ContainerBox = styled(Box)`
  height: 100%;
  min-height: 100vh;
  margin: 0px;
  position: relative;
  background: #f4f4f5;
`;
const ContentBox = styled(Box)`
  margin-left: ${(props: any) => (props.$minimize ? '105px' : '305px')};
  min-height: 100vh;
  overflow-z: auto;
  padding: 20px;
  transition: all 200ms;
`;
// Styled Component
/**
 * Returns UI (after the user logs in)
 * @params - none
 * @returns JSX.Element the Layout structure of the App ( UI after the user Logs in )
 */

const Layout = () => {
  const [minimize, setMinimize] = useState<boolean>(false);

  return (
    <>
      <ContainerBox>
        <Sidebar minimize={minimize} setMinimize={setMinimize} />
        <ContentBox $minimize={minimize}>
          <Router />
        </ContentBox>
      </ContainerBox>
    </>
  );
};

export default Layout;
