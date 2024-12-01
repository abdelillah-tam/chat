import { User } from '../../model/user';

type StateType = 'none' | 'success' | 'loading' | 'failed' | string;

export interface AuthState {
  state: StateType;
  userData:
    | {
        userToken: string;
        email: string;
        objectId: string;
      }
    | undefined;
  validToken: boolean | undefined;
  currentLoggedInUser: User | undefined;
  userInContact: User | undefined;
  foundUsers: User[] | undefined;
  newProfilePictureUrl: string;
}
