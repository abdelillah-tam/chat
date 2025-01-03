import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth-state";

const selectFeature = createFeatureSelector<AuthState>('auth');

export const selectState = createSelector(selectFeature, (state) => {
    return state;
});

export const selectCurrentLoggedInUser = createSelector(selectFeature, (state) => {
    return state.currentLoggedInUser;
});

export const selectUser = createSelector(selectFeature, (state) => state.userInContact);

export const selectFoundUsers = createSelector(selectFeature, (state) => state.foundUsers);

export const selectTokenValidation = createSelector(selectFeature, (state) => state.validToken);