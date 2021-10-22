import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';

export interface ILotteryCardProps {
  actions: JSX.Element | null;
  content: JSX.Element | null;
}

const LotteryCard: (props: ILotteryCardProps) => JSX.Element = (props: ILotteryCardProps): JSX.Element => {
  return (
    <Card sx={{ minWidth: 275 }}>
      <CardContent>{props.content}</CardContent>
      <CardActions>{props.actions}</CardActions>
    </Card>
  );
};

export default LotteryCard;
