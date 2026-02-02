import { createAction, props } from '@ngrx/store';
import { User } from '../../model/user';

export const SIGNUP = '[Signup Component] signup';

export const FULLNAME = '[Chat Component] get full name';

export const GET_CURRENT_LOGGEDIN_USER =
  '[Chat Component] get current full name';

export const RETRIEVED_CURRENT_LOGGEDIN_USER =
  '[Auth API] gotten current logged in user full name';

export const GET_USER_BY_OBJECT_ID = '[Chat Component] get user';

export const RETRIEVED_USER = '[Auth API] retrieved user';

export const GET_ALL_USERS_IN_CONTACT = '[Auth API] get all users in contact';

export const RETRIEVED_USERS = '[Auth API] retrieved users';

export const RETRIEVED_TOCKEN_CHECK = '[Auth API] result of token check';

export const FIND_USERS = '[Users Component] find users';

export const FIND_BY_EMAIL = '[Login Component] find user by email';

export const FIND_BY_ID = '[Users Component] find user by id';

export const ERROR_API = '[Auth API] error';

export const UPLOAD_PROFILE_PICTURE =
  '[Settings Component] upload profile picture';

export const RETRIEVED_PROFILE_PICTURE = '[Effect] gotten profile picture url';

export const UPDATE_USER_INFO = '[Settings Component] update user information';

export const UPDATED_USER_INFO = '[Effect] updated';

export const CHECK_TOKEN_IF_VALID = '[Home Component] check if token is valid';

export const GET_PROFILE_PICTURE_LINK =
  '[Settings Or Users Component] get profile picture link';

export const RETRIEVED_PROFILE_PICTURE_LINK =
  '[Effect] retrieved profile picture link';

export const RETRIEVED_FOUND_USER = '[Effect] retrieved found user';

export const REQUEST_CSRF_TOKEN = '[Login / Signup] request csrf token';

export const FINISHED_CSRF_REQUEST = '[Effect] finished csrf request';

export const signupAction = createAction(
  SIGNUP,
  props<{
    user: User;
    password: string | undefined;
    confirmationPassword: string | undefined;
  }>(),
);

export const errorAction = createAction(
  ERROR_API,
  props<{
    code: number;
    error: string;
  }>(),
);

export const emptyStateAction = createAction('[Login Component] empty state');

export const getFullNameAction = createAction(
  FULLNAME,
  props<{ objectId: string }>(),
);

export const getCurrentLoggedInUser = createAction(
  GET_CURRENT_LOGGEDIN_USER,
  props<{ objectId: string }>(),
);

export const retrievedCurrentLoggedInUserAction = createAction(
  RETRIEVED_CURRENT_LOGGEDIN_USER,
  props<{
    currentUserLoggedInOrError: User | { code: number; error: string };
  }>(),
);

export const getUserByObjectIdAction = createAction(
  GET_USER_BY_OBJECT_ID,
  props<{ objectId: string }>(),
);

export const getAllUsersInContactAction = createAction(
  GET_ALL_USERS_IN_CONTACT,
);

export const retrievedUserAction = createAction(
  RETRIEVED_USER,
  props<{
    user: User | { code: number; error: string };
  }>(),
);

export const retrievedUsersAction = createAction(
  RETRIEVED_USERS,
  props<{
    users: { user: User; channel: string; lastMessageTimestamp: number }[];
  }>(),
);

export const findUsersAction = createAction(
  FIND_USERS,
  props<{ name: string }>(),
);

export const uploadProfilePicAction = createAction(
  UPLOAD_PROFILE_PICTURE,
  props<{ file: File; userId: string }>(),
);

export const updateUserInfoAction = createAction(
  UPDATE_USER_INFO,
  props<{
    objectId: string;
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
    password: string | undefined;
    provider: string;
  }>(),
);

export const updatedInfosAction = createAction(
  UPDATED_USER_INFO,
  props<{ result: boolean }>(),
);

export const getProfilePictureLinkAction = createAction(
  GET_PROFILE_PICTURE_LINK,
  props<{ objectId: string }>(),
);

export const retrievedProfilePictureLinkAction = createAction(
  RETRIEVED_PROFILE_PICTURE_LINK,
  props<{ link: string }>(),
);

export const retrievedProfilePictureAction = createAction(
  RETRIEVED_PROFILE_PICTURE,
  props<{ link: string }>(),
);

export const checkIfTokenIsValidAction = createAction(CHECK_TOKEN_IF_VALID);

export const retrievedTokenCheckingAction = createAction(
  RETRIEVED_TOCKEN_CHECK,
  props<{ valid: boolean }>(),
);

export const findUserByEmailAction = createAction(
  FIND_BY_EMAIL,
  props<{ email: string }>(),
);

export const retrievedFoundUserByEmailAction = createAction(
  RETRIEVED_FOUND_USER,
  props<{ data: User | { code: number; error: string } }>(),
);

export const requestCsrfTokenAction = createAction(REQUEST_CSRF_TOKEN);

export const finishedCsrfTokenRequestAction = createAction(
  FINISHED_CSRF_REQUEST,
);
