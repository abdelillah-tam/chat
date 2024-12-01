import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppState } from './app-state.model';

const appSelectFeature = createFeatureSelector<AppState>('appState');

export const sideNavStateSelector = createSelector(
  appSelectFeature,
  (data) => data.sidenav
);
