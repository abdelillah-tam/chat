import { createReducer, on } from '@ngrx/store';
import { closeSidenaveAction, openSidenavAction } from './app.actions';
import { AppState } from './app-state.model';

const appState: AppState = {
  sidenav: false,
};

export const appReducer = createReducer(
  appState,
  on(openSidenavAction, (state) => {
    return {
      ...state,
      sidenav: true,
    };
  }),
  on(closeSidenaveAction, (state) => {
    return {
      ...state,
      sidenav: false,
    };
  })
);
