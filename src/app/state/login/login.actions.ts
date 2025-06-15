import { createAction, props } from '@ngrx/store';

export const LOGIN = '[Login Component] login';
export const AUTH_API_LOGIN = '[Auth API] login success';
export const LOGOUT = '[App Component] logout';

export const loginAction = createAction(
  LOGIN,
  props<{ email: string; password: string; provider: string }>()
);

export const loginResultAction = createAction(
  AUTH_API_LOGIN,
  props<{ email: string; userToken: string; objectId: string }>()
);

export const logoutAction = createAction(LOGOUT);

