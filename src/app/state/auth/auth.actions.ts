import { createAction, props } from '@ngrx/store';
import { User } from '../../model/user';

export const signupAction = createAction(
  '[Signup Component] signup',
  props<{
    user: User;
    password: string | undefined;
    passwordConfirmation: string | undefined;
  }>(),
);

export const errorAction = createAction(
  '[Auth API] error',
  props<{
    code: number;
    error: string;
  }>(),
);

export const emptyStateAction = createAction('[Login Component] empty state');

export const loadLoggedInUser = createAction(
  '[Chat Component] get current full name',
  props<{ objectId: string }>(),
);

export const loadLoggedInUserSuccess = createAction(
  '[Auth API] logged in user loaded successfully',
  props<{
    currentUserLoggedInOrError: User | { code: number; error: string };
  }>(),
);

export const loadUserById = createAction(
  '[Chat Component] load user by id',
  props<{ id: string }>(),
);

export const loadUserSuccess = createAction(
  '[Auth API] loaded user by id successfully',
  props<{
    user: User | { code: number; error: string };
  }>(),
);

export const loadUserFailure = createAction(
  '[Auth API] loaded user by id failed',
  props<{ code: number; error: string }>(),
);

export const loadUsersInContact = createAction(
  '[Auth API] get all users in contact',
);

export const loadUsersInContactSuccess = createAction(
  '[Auth API] retrieved users',
  props<{
    users: { user: User; channel: string; lastMessageTimestamp: number }[];
  }>(),
);

export const findUsers = createAction(
  '[Users Component] find users',
  props<{ name: string }>(),
);

export const uploadProfilePicAction = createAction(
  '[Settings Component] upload profile picture',
  props<{ formData: FormData }>(),
);

export const updateUserInfo = createAction(
  '[Settings Component] update user information',
  props<{
    firstName: string | undefined;
    lastName: string | undefined;
    email: string | undefined;
  }>(),
);

export const updateUserInfoSuccess = createAction(
  '[Effect] User Info has been updated',
  props<{ result: boolean }>(),
);


export const updatePassword = createAction(
  '[Settings Component] update user password',
  props<{
    currentPassword: string;
    newPassword: string;
    passwordConfirmation: string;
  }>(),
);

export const updatePasswordSuccess = createAction(
  '[Effect] User password has been updated',
  props<{ result: boolean }>(),
);

export const requestCsrfTokenAction = createAction(
  '[Login / Signup] request csrf token',
);

export const requestCsrfTokenSuccess = createAction(
  '[Effect] csrf requested successfully',
);
