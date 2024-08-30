import { createAction, props } from "@ngrx/store";
import { User } from "../../model/user";

export const SIGNUPACTION = '[Signup Component] signup';
export const LOGINACTION = '[Login Component] login';
export const AUTHAPI = '[Auth API] login';
export const ERRORAPI = '[Auth API] error'

export const signup = createAction(SIGNUPACTION, props<User>());
export const login = createAction(LOGINACTION, props<{ email: string, password: string }>());
export const loginResult = createAction(AUTHAPI, props<{email: string; 'user-token': string; objectId: string}>());
export const errorLogin = createAction(ERRORAPI);