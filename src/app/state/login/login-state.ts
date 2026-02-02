import { StateType } from '../auth/auth-state';

export interface LoginState {
  email: string | undefined;
  id: string | undefined;
  state: StateType;
  message: string;
}
