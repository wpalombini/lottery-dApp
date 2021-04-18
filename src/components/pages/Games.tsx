import { Button, TextField, Typography } from '@material-ui/core';
import React, { createRef, Fragment, useEffect, useState } from 'react';
import { BlockchainService, GameStateEnum } from '../../services/BlockchainService';
import LotteryCard from '../Card';

export interface IGamesPage {
  blockchainService: BlockchainService;
}

const Games: (props: IGamesPage) => JSX.Element = (props: IGamesPage): JSX.Element => {
  const [canBet, setCanBet] = useState(false);
  const [hasActiveGame, setHasActiveGame] = useState(false);
  const betNumbersTxt = createRef<HTMLInputElement>();

  useEffect(() => {
    setCurrentGameState();
  }, []);

  const placeBet: () => Promise<void> = async (): Promise<void> => {
    if (betNumbersTxt && betNumbersTxt.current) {
      const n1: number = parseInt(betNumbersTxt.current.value[0]);
      const n2: number = parseInt(betNumbersTxt.current.value[1]);
      const n3: number = parseInt(betNumbersTxt.current.value[2]);
      const n4: number = parseInt(betNumbersTxt.current.value[3]);
      await props.blockchainService.placeBet(n1, n2, n3, n4);
    }
  };

  const handleChangeNumbers: () => void = (): void => {
    if (betNumbersTxt && betNumbersTxt.current) {
      setCanBet(betNumbersTxt.current.value.length === 4 && !isNaN(parseInt(betNumbersTxt.current.value)));
    }
  };

  const setCurrentGameState: () => Promise<void> = async (): Promise<void> => {
    const currentGameState: GameStateEnum = await props.blockchainService.getCurrentGameState();

    if (currentGameState == GameStateEnum.OPEN) {
      setHasActiveGame(true);
    }
  };

  return (
    <LotteryCard
      actions={
        <Fragment>
          <Button onClick={placeBet} disabled={!canBet} variant="contained" color="primary">
            Place bet
          </Button>
        </Fragment>
      }
      content={
        <Fragment>
          <Typography variant="h6">Place a new bet:</Typography>
          <TextField
            label="Bet Numbers"
            type="number"
            inputRef={betNumbersTxt}
            onChange={handleChangeNumbers}
            style={{ visibility: hasActiveGame ? 'visible' : 'hidden' }}
          />
        </Fragment>
      }
    />
  );
};

export default Games;
