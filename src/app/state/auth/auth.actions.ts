import { createAction, props } from "@ngrx/store";
import { User } from "../../model/user";

export const SIGNUPACTION = '[Signup Component] signup';
export const LOGINACTION = '[Login Component] login';

export const AUTHAPILOGIN = '[Auth API] login success';
export const AUTHAPISIGNUP = '[Auth API] signup success';

export const FULLNAME = '[Chat Component] get full name';

export const GETCURRENTLOGGEDINUSER = '[Chat Component] get current full name';

export const GOTTENCURRENTLOGGEDINUSER = '[Auth API] gotten current logged in user full name';

export const GETUSERBYOBJECTID = '[Chat Component] get user';

export const GOTTENUSER = '[Auth API] gotten user';

export const GETALLUSERSINCONTACT = '[Messaging Service] get all users in contact';

export const GOTTENUSERS = '[Auth API] gotten users';

export const CHECKTOKENIFVALID = '[HomeComponent] check if token is valid';

export const TOKENCHECKRESULT = '[Auth API] result of token check';

export const ERRORAPI = '[Auth API] error';

export const signupAction = createAction(SIGNUPACTION, props<{ user: User; password: string; provider: string }>());

export const loginAction = createAction(LOGINACTION, props<{ email: string; password: string; }>());

export const loginResultAction = createAction(AUTHAPILOGIN, props<{ email: string; 'user-token': string; objectId: string }>());

export const errorAction = createAction(ERRORAPI);

export const emptyStateAction = createAction('[Login Component] empty state');

export const getFullNameAction = createAction(FULLNAME, props<{ objectId: string }>());

export const getCurrentLoggedInUser = createAction(GETCURRENTLOGGEDINUSER, props<{ objectId: string }>());

export const gottenCurrentLoggedInUserAction = createAction(GOTTENCURRENTLOGGEDINUSER, props<{ currentUserLoggedIn: User }>());

export const getUserByObjectIdAction = createAction(GETUSERBYOBJECTID, props<{ objectId: string }>());

export const getAllUsersInContactAction = createAction(GETALLUSERSINCONTACT, props<{ objectsId: string[] }>());

export const gottenUserAction = createAction(GOTTENUSER, props<{ user: User }>());

export const gottenUsersAction = createAction(GOTTENUSERS, props<{ users: User[] }>());

export const checkIfTokenIsValidAction = createAction(CHECKTOKENIFVALID, props<{ token: string }>());

export const resultOfTokenCheckingAction = createAction(TOKENCHECKRESULT, props<{ valid: boolean }>());