import React, { Fragment, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { BlockchainStateModel } from './Layout';
import LotteryCard from '../Card';
import { Link } from 'react-router-dom';

export interface INavBarProps {
  blockchain: BlockchainStateModel;
  onBalanceClicked: () => Promise<void>;
  onAccountClicked: (content: JSX.Element) => void;
  onConnectClicked: () => Promise<void>;
  onMenuClicked: () => void;
}

const DivContainerStyled = styled('div')(
  // eslint-disable-next-line
  ({ theme }) =>
    `
  flex-grow: 1
`,
);

const NavBar: (props: INavBarProps) => JSX.Element = (props: INavBarProps): JSX.Element => {
  useEffect(() => {
    const getBalance: () => Promise<void> = async (): Promise<void> => {
      if (props.blockchain.isConnected) {
        await props.onBalanceClicked();
      }
    };

    getBalance();
  }, [props.blockchain.isConnected]);

  const balanceContainer: JSX.Element = props.blockchain.accountAddress ? (
    <Button
      onClick={() =>
        props.onAccountClicked(
          <LotteryCard
            actions={
              <Button color="primary" size="small">
                Disconnect (todo)
              </Button>
            }
            content={
              <Fragment>
                <Typography color="textSecondary">Balance:</Typography>
                <Typography variant="h4" component="h4">
                  {props.blockchain.balance} ETH
                </Typography>
              </Fragment>
            }
          />,
        )
      }
      color="inherit"
    >
      {props.blockchain.accountAddress?.slice(0, 5)}(...)
      {props.blockchain.accountAddress?.slice(props.blockchain.accountAddress.length - 5)}
    </Button>
  ) : (
    <Button onClick={props.onConnectClicked} color="inherit" variant="outlined">
      Connect Wallet
    </Button>
  );

  return (
    <DivContainerStyled>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            onClick={props.onMenuClicked}
            edge="start"
            sx={{ marginRight: (theme) => theme.spacing(2) }}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            <Link to="/">Lottery dApp</Link>
          </Typography>
          {balanceContainer}
        </Toolbar>
      </AppBar>
    </DivContainerStyled>
  );
};

export default NavBar;
