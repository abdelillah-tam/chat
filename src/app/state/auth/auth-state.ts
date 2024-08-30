type StateType = 'none' | 'success' | 'loading' | 'failed' | string;

export class AuthState{
    state : StateType = 'none';
    userToken : string = '';
    email: string = '';
    objectId: string = '';
}