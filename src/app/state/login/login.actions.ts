import { createAction, props } from '@ngrx/store';

export const LOGIN = '[Login Component] login';
export const AUTH_API_LOGIN_SUCCESS = '[Auth API] login success';
export const AUTH_API_LOGIN_FAILED = '[Auth API] login failed';
export const LOGOUT = '[App Component] logout';

export const loginAction = createAction(
  LOGIN,
  props<{ email: string; password: string; provider: string }>(),
);

export const successLoginAction = createAction(
  AUTH_API_LOGIN_SUCCESS,
  props<{ email: string; id: number }>(),
);

export const failedLoginAction = createAction(
  AUTH_API_LOGIN_FAILED,
  props<{ message: string; }>(),
);

export const logoutAction = createAction(LOGOUT);
