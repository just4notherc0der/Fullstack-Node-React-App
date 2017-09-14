import axios from 'axios';
import { FETCH_USER } from './types';

/* OLD CODE
export const fetchUser = () => {
  return function(dispatch) {  // redux-thunk calls it
    axios.get('/api/current_user')
      .then(res => dispatch({ type: FETCH_USER, payload: res.data })); // just cares about express response data, no need to pass whole response with all of the garbage
  }
};
*/

// New synatx
export const fetchUser = () => async (dispatch) => {
  const res = await axios.get('/api/current_user');
  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = (token) => async (dispatch) => {
  const res = await axios.post('/api/stripe', token);
  dispatch({ type: FETCH_USER, payload: res.data });
};
