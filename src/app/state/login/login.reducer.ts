import { createReducer, on } from '@ngrx/store';
import {
  successLoginAction,
  logoutAction,
  failedLoginAction,
} from './login.actions';
import { LoginState } from './login-state';

const initialState: LoginState = {
  email: '',
  id: '',
  state: 'none',
  message: '',
};

export const loginReducer = createReducer(
  initialState,
  on(successLoginAction, (state, data) => {
    return {
      ...state,
      state: 'success',
      email: data.email,
      id: String(data.id),
    };
  }),
  on(failedLoginAction, (state, data) => {
    console.log(data);
    return { ...state, state: 'failed', message: data.message };
  }),
  on(logoutAction, (state, data) => {
    return { ...state, email: '', objectId: '', userToken: '', state: 'none' };
  }),
);
