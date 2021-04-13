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
  const [currentGameId, setCurrentGameId] = useState(0);
  const [totalBetsAmount, setTotalBetsAmount] = useState('');
  const drawNumbersTxt = createRef<HTMLInputElement>();

  useEffect(() => {
    setCurrentGameState();
  }, []);

  const setCurrentGameState: () => Promise<void> = async (): Promise<void> => {
    const currentGameState: GameStateEnum = await props.blockchainService.getCurrentGameState();

    if (currentGameState == GameStateEnum.OPEN) {
      const currentGameId: number = await props.blockchainService.getCurrentGameId();
      const totalBetsAmount: string = await props.blockchainService.getTotalBetsAmount(currentGameId);
      setCurrentGameId(currentGameId);
      setTotalBetsAmount(totalBetsAmount);
      setCanStartGame(false);
    }
  };

  const startNewGame: () => Promise<void> = async (): Promise<void> => {
    await props.blockchainService.startGame();

    setCurrentGameState();
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
    if (!canStartGame && drawNumbersTxt && drawNumbersTxt.current) {
      setCanDrawNumbers(drawNumbersTxt.current.value.length === 4 && !isNaN(parseInt(drawNumbersTxt.current.value)));
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
          <Typography variant="h6">Manage game:</Typography>
          <Typography variant="body1" style={{ visibility: canStartGame ? 'hidden' : 'visible' }}>
            <b>Current game Id</b>: {currentGameId}
          </Typography>
          <Typography variant="body1" style={{ visibility: canStartGame ? 'hidden' : 'visible' }}>
            <b>Total bets amount</b>: {totalBetsAmount} Gwei
          </Typography>
          <TextField
            label="Result Numbers"
            type="number"
            inputRef={drawNumbersTxt}
            onChange={handleChangeNumbers}
            style={{ visibility: canStartGame ? 'hidden' : 'visible' }}
          />
        </Fragment>
      }
    />
  );
};

export default Admin;
