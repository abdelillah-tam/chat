import { createFeatureSelector, createSelector } from "@ngrx/store";
import { AuthState } from "./auth-state";

const selectFeature = createFeatureSelector<AuthState>('auth');

export const selectState = createSelector(selectFeature, (state) => {
    return state;
});