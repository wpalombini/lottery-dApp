import React from 'react';
import { Dialog, DialogContent } from '@mui/material';

export interface IDialogProps {
  content: JSX.Element | null;
  isOpen: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

const LotteryDialog: (props: IDialogProps) => JSX.Element = (props: IDialogProps): JSX.Element => {
  const { onClose, selectedValue, isOpen } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  return (
    <Dialog onClose={handleClose} aria-labelledby="dialog-title" open={isOpen}>
      <DialogContent
        sx={{
          padding: 0,
          '&:first-of-type': {
            paddingTop: 0,
          },
        }}
      >
        {props.content}
      </DialogContent>
    </Dialog>
  );
};

export default LotteryDialog;
