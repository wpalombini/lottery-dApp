import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { AnimatedSwitch, spring } from 'react-router-transition';
import './Layout.css';
import { BlockchainService } from '../../services/BlockchainService';
import LotteryDialog from '../Dialog';
import About from '../pages/About';
import Home from '../pages/Home';
import NavBar from './NavBar';
import SideMenu, { IListItem } from './SideMenu';
import { AttachMoney, Build, House, Info } from '@material-ui/icons';
import Games from '../pages/Games';
import { Container } from '@material-ui/core';
import Admin from '../pages/Admin';

export class BlockchainStateModel {
  public accountAddress: string | null;
  public isConnected: boolean;
  public balance: string;
}

const blockchainService: BlockchainService = new BlockchainService();

const Layout: () => JSX.Element = (): JSX.Element => {
  const [blockchain, setBlockchain] = useState(new BlockchainStateModel());
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [selectedDialogValue, setSelectedDialogValue] = useState('');
  const [dialogContent, setDialogContent] = useState(null);
  const [isSideMenuOpen, setIsSideMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState([
    {
      title: 'Home',
      url: '/',
      icon: <House />,
    },
    {
      title: 'Games',
      url: '/games',
      icon: <AttachMoney />,
    },
    {
      title: 'About',
      url: '/about',
      icon: <Info />,
    },
  ]);

  const handleConnect: () => Promise<void> = async (): Promise<void> => {
    try {
      await blockchainService.connect();

      if (blockchainService.isAdmin()) {
        setMenuItems((currentMenuItems: Array<IListItem>) => [
          ...currentMenuItems,
          { title: 'Admin', url: '/admin', icon: <Build /> },
        ]);
      }

      setBlockchain({
        ...blockchain,
        accountAddress: blockchainService.getCurrentAccountAddress(),
        isConnected: true,
      });
    } catch (error) {
      console.log('onConnectHandler error: ', error);
    }
  };

  const handleGetBalance: () => Promise<void> = async (): Promise<void> => {
    const balance: string = await blockchainService.getBalance();

    setBlockchain({
      ...blockchain,
      balance: balance,
    });
  };

  const handleAccountAddressClick: (content: any) => void = (content: any) => {
    setDialogContent(content);
    setDialogOpen(true);
  };

  const handleToggleMenu: () => void = (): void => {
    setIsSideMenuOpen(!isSideMenuOpen);
  };

  const handleCloseDialog = (value: string) => {
    setDialogOpen(false);
    setSelectedDialogValue(value);
  };

  const slide = (val: any) => {
    return spring(val, {
      stiffness: 80,
      damping: 12,
    });
  };

  const pageTransitions = {
    atEnter: {
      offset: -100,
    },
    atLeave: {
      offset: slide(-1000),
    },
    atActive: {
      offset: slide(0),
    },
  };

  return (
    <Router>
      <NavBar
        onMenuClicked={handleToggleMenu}
        onAccountClicked={handleAccountAddressClick}
        onConnectClicked={handleConnect}
        onBalanceClicked={handleGetBalance}
        blockchain={blockchain}
      />
      <SideMenu listItems={menuItems} isSideMenuOpen={isSideMenuOpen} toggleSideMenu={handleToggleMenu}></SideMenu>
      <Container maxWidth="md" className="container">
        <AnimatedSwitch
          atEnter={pageTransitions.atEnter}
          atLeave={pageTransitions.atLeave}
          atActive={pageTransitions.atActive}
          mapStyles={(styles) => ({
            transform: `translateX(${styles.offset}%)`,
          })}
          className="switch-wrapper"
        >
          <Route exact path="/" component={Home} />
          <Route path="/about/" component={About} />
          <Route path="/admin/" render={(props) => <Admin {...props} blockchainService={blockchainService} />} />
          <Route path="/games/" component={Games} />
          <Route path="*">
            <Redirect to="/" />
          </Route>
        </AnimatedSwitch>
      </Container>
      <LotteryDialog
        content={dialogContent}
        selectedValue={selectedDialogValue}
        isOpen={isDialogOpen}
        onClose={handleCloseDialog}
      />
    </Router>
  );
};

export default Layout;
