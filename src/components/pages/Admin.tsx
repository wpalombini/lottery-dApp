import { Button, Typography } from '@material-ui/core';
import React, { Fragment } from 'react';
import { BlockchainService } from '../../services/BlockchainService';
import LotteryCard from '../Card';

export interface IAdminPage {
  blockchainService: BlockchainService;
}

const Admin: (props: IAdminPage) => JSX.Element = (props: IAdminPage): JSX.Element => {
  const startNewGame: () => Promise<void> = async (): Promise<void> => {
    console.log('isAdmin', props.blockchainService.isAdmin());
    await props.blockchainService.startGame();
  };

  return (
    <LotteryCard
      actions={
        <Button onClick={startNewGame} variant="contained" color="primary">
          Start new game
        </Button>
      }
      content={
        <Fragment>
          <Typography variant="body1">Starting a game: ...</Typography>
        </Fragment>
      }
    />
  );
};

export default Admin;
