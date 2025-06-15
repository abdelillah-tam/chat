import { StateType } from '../auth/auth-state';

export interface LoginState {
  userToken: string | undefined;
  email: string | undefined;
  objectId: string | undefined;
  state: StateType;
}
