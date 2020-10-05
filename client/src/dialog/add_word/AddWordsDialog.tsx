import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
// Translation
import tr from './add_words_dialog.tr.json';
import {Language} from '../../types';
// Redux
import store from '../../redux/store';
import {setDialog} from '../../redux/actions';
import {useSelector} from 'react-redux';

const AddWordsDialog = () => {
  const {language} = useSelector((state: {language: Language}) => state);
  const ln = language;

  return (
    <div>
      <Dialog open={true} onClose={() => store.dispatch(setDialog(''))}>
        <DialogTitle id="form-dialog-title">{tr.title[ln]}</DialogTitle>
        <DialogContent>
          <DialogContentText>{tr.word[ln]}{tr.desc[ln]}</DialogContentText>
          <TextField autoFocus margin="dense" id="word" label={tr.word[ln]} fullWidth />
          <TextField margin="dense" id="pronun" label={tr.pronun[ln]} fullWidth/>
          <TextField margin="dense" id="define" label={tr.define[ln]} fullWidth/>
          <TextField margin="dense" id="example" label={tr.example[ln]} fullWidth/>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => store.dispatch(setDialog(''))} color="primary">
            Cancel
          </Button>
          <Button onClick={() => store.dispatch(setDialog(''))} color="primary">
            Subscribe
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AddWordsDialog;