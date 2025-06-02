import { Store } from '@ngrx/store';
import { getCurrentLoggedInUser } from '../state/auth/auth.actions';

export function getCurrentUser(store: Store) {
  store.dispatch(
    getCurrentLoggedInUser({
      objectId: localStorage.getItem('objectId')!
    })
  );
}
