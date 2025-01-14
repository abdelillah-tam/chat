import { createAction, props } from '@ngrx/store';
import { User } from '../../model/user';

export const SIGNUP = '[Signup Component] signup';
export const LOGIN = '[Login Component] login';

export const AUTH_API_LOGIN = '[Auth API] login success';
export const AUTH_API_SIGNUP = '[Auth API] signup success';

export const FULLNAME = '[Chat Component] get full name';

export const GET_CURRENT_LOGGEDIN_USER = '[Chat Component] get current full name';

export const RETRIEVED_CURRENT_LOGGEDIN_USER =
  '[Auth API] gotten current logged in user full name';

export const GET_USER_BY_OBJECT_ID = '[Chat Component] get user';

export const RETRIEVED_USER = '[Auth API] retrieved user';

export const GET_ALL_USERS_IN_CONTACT = '[Auth API] get all users in contact';

export const RETRIEVED_USERS = '[Auth API] retrieved users';

export const CHECK_TOKEN_IF_VALID = '[Home Component] check if token is valid';

export const RETRIEVED_TOCKEN_CHECK = '[Auth API] result of token check';

export const FIND_USERS = '[Users Component] find users';

export const ERROR_API = '[Auth API] error';

export const UPLOAD_PROFILE_PICTURE =
  '[Settings Component] upload profile picture';

export const GOTTEN_PROFILE_PICTURE_URL = '[Effect] gotten profile picture url';

export const UPDATE_USER_INFO = '[Settings Component] update user information';

export const signupAction = createAction(
  SIGNUP,
  props<{ user: User; password: string; provider: string }>()
);

export const loginAction = createAction(
  LOGIN,
  props<{ email: string; password: string }>()
);

export const loginResultAction = createAction(
  AUTH_API_LOGIN,
  props<{ email: string; userToken: string; objectId: string }>()
);

export const errorAction = createAction(ERROR_API);

export const emptyStateAction = createAction('[Login Component] empty state');

export const getFullNameAction = createAction(
  FULLNAME,
  props<{ objectId: string }>()
);

export const getCurrentLoggedInUser = createAction(
  GET_CURRENT_LOGGEDIN_USER,
  props<{ objectId: string }>()
);

export const retrievedCurrentLoggedInUserAction = createAction(
  RETRIEVED_CURRENT_LOGGEDIN_USER,
  props<{ currentUserLoggedIn: User }>()
);

export const getUserByObjectIdAction = createAction(
  GET_USER_BY_OBJECT_ID,
  props<{ objectId: string }>()
);

export const getAllUsersInContactAction = createAction(
  GET_ALL_USERS_IN_CONTACT
);

export const retrievedUserAction = createAction(
  RETRIEVED_USER,
  props<{ user: User }>()
);

export const retrievedUsersAction = createAction(
  RETRIEVED_USERS,
  props<{ users: User[] }>()
);

export const checkIfTokenIsValidAction = createAction(
  CHECK_TOKEN_IF_VALID,
  props<{ token: string }>()
);

export const resultOfTokenCheckingAction = createAction(
  RETRIEVED_TOCKEN_CHECK,
  props<{ valid: boolean }>()
);

export const findUsersAction = createAction(
  FIND_USERS,
  props<{ name: string }>()
);

export const uploadProfilePicAction = createAction(
  UPLOAD_PROFILE_PICTURE,
  props<{ file: File; user: string }>()
);

export const retrievedProfilePictureUrlAction = createAction(
  GOTTEN_PROFILE_PICTURE_URL,
  props<{ url: string }>()
);

export const updateUserInfoAction = createAction(
  UPDATE_USER_INFO,
  props<{
    objectId: string;
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
    password: string | undefined;
    profileImageLink: string;
  }>()
);
