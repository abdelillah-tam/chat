import { createAction } from '@ngrx/store';

const OPEN_SIDE_NAV = '[Users Component] open sidenav';
const CLOSE_SIDE_NAV = '[Users Component] close sidenav';

export const openSidenavAction = createAction(OPEN_SIDE_NAV);

export const closeSidenaveAction = createAction(CLOSE_SIDE_NAV);
