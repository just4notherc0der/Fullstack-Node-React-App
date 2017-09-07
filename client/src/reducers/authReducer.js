import { FETCH_USER } from '../actions/types';

export default function(state = null, action) {
  switch(action.type) {
    case FETCH_USER:
      return action.payload || false;
    default:
      return state;
  }
}

/*

null, action.payload(user model), false - explained in authReducer diagram

*/
