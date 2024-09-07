import { createReducer, on } from "@ngrx/store";
import { emptyStateAction, errorAction, gottenCurrentLoggedInUserAction, gottenUserAction, gottenUsersAction, loginResultAction, resultOfTokenCheckingAction } from "./auth.actions";
import { AuthState } from "./auth-state";

const initialState: AuthState = {
    state: 'none',
    userData: undefined,
    validToken: undefined,
    currentLoggedInUser: undefined,
    userInContact: undefined,
    foundUsers: []
};


export const authReducer = createReducer(
    initialState,
    on(loginResultAction, (state, data) => {
        return {
            ...state,
            state: 'success',
            userData: {
                email: data.email,
                userToken: data["user-token"],
                objectId: data.objectId
            }
        };
    }),
    on(errorAction, (state) => {
        return { ...state, state: 'failed' };
    }),
    on(emptyStateAction, (state) => {
        return { ...state, state: 'none', userData: undefined, userInContact: undefined }
    }),
    on(gottenCurrentLoggedInUserAction, (state, data) => {
        return { ...state, currentLoggedInUser: data.currentUserLoggedIn }
    }),
    on(gottenUserAction, (state, data) => {
        return { ...state, userInContact: data.user }
    }),
    on(gottenUsersAction, (state, data) => {
        return { ...state, foundUsers: data.users };
    }),
    on(resultOfTokenCheckingAction, (state, data) => {
        return { ...state, validToken: data.valid };
    })
);

