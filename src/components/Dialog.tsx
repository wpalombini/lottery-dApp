import { Dialog, DialogContent, makeStyles } from '@material-ui/core';
import React from 'react';

export interface IDialogProps {
  content: JSX.Element | null;
  isOpen: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

const useStyles = makeStyles({
  root: {
    padding: 0,
    '&:first-child': {
      paddingTop: 0,
    },
  },
});

const LotteryDialog: (props: IDialogProps) => JSX.Element = (props: IDialogProps): JSX.Element => {
  const classes = useStyles();
  const { onClose, selectedValue, isOpen } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="dialog-title" open={isOpen}>
      <DialogContent className={classes.root}>{props.content}</DialogContent>
    </Dialog>
  );
};

export default LotteryDialog;
