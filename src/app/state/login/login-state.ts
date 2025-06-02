import { StateType } from '../auth/auth-state';

export interface LoginState {
  userToken: string;
  email: string;
  objectId: string;
  state: StateType;
}
