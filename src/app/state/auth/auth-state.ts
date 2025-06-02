import { User } from '../../model/user';

export type StateType = 'none' | 'success' | 'loading' | 'failed' | string;

export interface AuthState {
  state: StateType;
  currentLoggedInUser: User | undefined | { code: number; error: string };
  currentProfilePictureLink: string | undefined;
  userInContact: User | undefined | { code: number; error: string };
  foundUsers:
    | ({ user: User; channel: string; lastMessageTimestamp: number } | User)[]
    | undefined;
  tokenValidation: boolean | undefined;
}
