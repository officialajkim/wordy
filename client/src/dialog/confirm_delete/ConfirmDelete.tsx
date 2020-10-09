import React, {Fragment} from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { State } from '../../types';
// Translation
import tr from './confirm_delete.tr.json';
// Redux
import store from '../../redux/store';
import {offDialog} from '../../redux/actions';
import {useSelector} from 'react-redux';

type PayloadType = { wordID: string, word: string }

const  ConfirmDelete:React.FC= () => {
  const {language, dialog} = useSelector((state: State) => state);
  const ln = language;
  // @ ABSOLUTE
  const handleWordDelete = () => {
    
  };

  const payload = dialog.payload as PayloadType;

  return (
    <Fragment>
      <Dialog
        open={true}
        onClose={() => store.dispatch(offDialog())}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{tr.title[ln]}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-word-confirm">
            {`${tr.word[ln]}: ${payload.word}`}
          </DialogContentText>
          <DialogContentText id="alert-dialog">
            {tr.ask[ln]}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => store.dispatch(offDialog())} color="primary">
            {tr.cancelBtn[ln]}
          </Button>
          <Button onClick={() => store.dispatch(offDialog())} color="secondary" autoFocus>
            {tr.deleteBtn[ln]}
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
}

export default ConfirmDelete;