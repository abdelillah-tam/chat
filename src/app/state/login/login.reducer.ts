import { createReducer, on } from '@ngrx/store';
import { loginResultAction } from './login.actions';
import { LoginState } from './login-state';

const initialState: LoginState = {
  email: '',
  objectId: '',
  userToken: '',
  state: 'none',
};

export const loginReducer = createReducer(
  initialState,
  on(loginResultAction, (state, data) => {
    return {
      ...state,
      state: 'success',
      email: data.email,
      userToken: data.userToken,
      objectId: data.objectId,
    };
  })
);
