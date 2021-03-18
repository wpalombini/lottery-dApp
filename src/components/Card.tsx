import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';

export interface ILotteryCardProps {
  actions: JSX.Element | null;
  content: JSX.Element | null;
}

const useStyles = makeStyles({
  root: {
    minWidth: 275,
  },
});

const LotteryCard: (props: ILotteryCardProps) => JSX.Element = (props: ILotteryCardProps): JSX.Element => {
  const classes = useStyles();

  return (
    <Card className={classes.root}>
      <CardContent>{props.content}</CardContent>
      <CardActions>{props.actions}</CardActions>
    </Card>
  );
};

export default LotteryCard;
