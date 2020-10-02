import * as actions from '../actionTypes';

const dialog = (state = '', action: any) => {
  switch(action.type) {
    case actions.SET_DIALOG:
      return action.payload.toWhat;
      
    default:
      return state;
  }
}

export default dialog;