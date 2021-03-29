import { Button, Typography } from '@material-ui/core';
import React, { Fragment, useEffect, useState } from 'react';
import { BlockchainService, GameStateEnum } from '../../services/BlockchainService';
import LotteryCard from '../Card';

export interface IAdminPage {
  blockchainService: BlockchainService;
}

const Admin: (props: IAdminPage) => JSX.Element = (props: IAdminPage): JSX.Element => {
  const [btnDisabled, setBtnDisabled] = useState(false);

  useEffect(() => {
    const getCurrentGameState: () => Promise<void> = async (): Promise<void> => {
      const currentGameState: GameStateEnum = await props.blockchainService.getCurrentGameState();

      if (currentGameState == GameStateEnum.OPEN) {
        setBtnDisabled(true);
      }
    };

    getCurrentGameState();
  }, []);

  const startNewGame: () => Promise<void> = async (): Promise<void> => {
    await props.blockchainService.startGame();

    // should be subscribing to an rxjs/Observable and gettig a boolean (game started sucessfully) from rxjs/Subject
    const currentGameState: GameStateEnum = await props.blockchainService.getCurrentGameState();
    if (currentGameState == GameStateEnum.OPEN) {
      setBtnDisabled(true);
    }
  };

  return (
    <LotteryCard
      actions={
        <Button onClick={startNewGame} disabled={btnDisabled} variant="contained" color="primary">
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
