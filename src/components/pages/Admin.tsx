import { Button, TextField, Typography } from '@material-ui/core';
import React, { createRef, Fragment, useEffect, useState } from 'react';
import { BlockchainService, GameStateEnum } from '../../services/BlockchainService';
import LotteryCard from '../Card';

export interface IAdminPage {
  blockchainService: BlockchainService;
}

const Admin: (props: IAdminPage) => JSX.Element = (props: IAdminPage): JSX.Element => {
  const [canStartGame, setCanStartGame] = useState(true);
  const [canDrawNumbers, setCanDrawNumbers] = useState(false);
  const drawNumbersTxt = createRef<HTMLInputElement>();

  useEffect(() => {
    const getCurrentGameState: () => Promise<void> = async (): Promise<void> => {
      const currentGameState: GameStateEnum = await props.blockchainService.getCurrentGameState();

      if (currentGameState == GameStateEnum.OPEN) {
        setCanStartGame(false);
      }
    };

    getCurrentGameState();
  }, []);

  const startNewGame: () => Promise<void> = async (): Promise<void> => {
    await props.blockchainService.startGame();

    // should be subscribing to an rxjs/Observable and gettig a boolean (game started sucessfully) from rxjs/Subject
    const currentGameState: GameStateEnum = await props.blockchainService.getCurrentGameState();
    if (currentGameState == GameStateEnum.OPEN) {
      setCanStartGame(false);
    }
  };

  const drawNumbers: () => Promise<void> = async (): Promise<void> => {
    if (drawNumbersTxt && drawNumbersTxt.current && drawNumbersTxt.current.value) {
      await props.blockchainService.drawNumbers(parseInt(drawNumbersTxt.current.value));

      const currentGameState: GameStateEnum = await props.blockchainService.getCurrentGameState();
      if (currentGameState == GameStateEnum.CLOSED) {
        drawNumbersTxt.current.value = '';
        setCanStartGame(true);
        setCanDrawNumbers(false);
      }
    }
  };

  const handleChangeNumbers: () => void = (): void => {
    if (!canStartGame && drawNumbersTxt && drawNumbersTxt.current && drawNumbersTxt.current.value) {
      const numbers = parseInt(drawNumbersTxt.current.value);
      setCanDrawNumbers(numbers >= 0 && numbers <= 9999);
    }
  };

  return (
    <LotteryCard
      actions={
        <Fragment>
          <Button onClick={startNewGame} disabled={!canStartGame} variant="contained" color="primary">
            Start new game
          </Button>
          <Button onClick={drawNumbers} disabled={!canDrawNumbers} variant="contained" color="primary">
            Draw numbers
          </Button>
        </Fragment>
      }
      content={
        <Fragment>
          <Typography variant="body1">Manage game:</Typography>
          <TextField label="Result Numbers" type="number" inputRef={drawNumbersTxt} onChange={handleChangeNumbers} />
        </Fragment>
      }
    />
  );
};

export default Admin;
