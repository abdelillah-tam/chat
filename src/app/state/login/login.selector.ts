import { createFeatureSelector, createSelector } from "@ngrx/store";
import { LoginState } from "./login-state";

const selectFeature = createFeatureSelector<LoginState>('login');

export const selectLoginState = createSelector(selectFeature, (state) => state);