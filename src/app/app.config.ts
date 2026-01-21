import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import {
  HttpClient,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { provideState, provideStore, Store } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { authReducer } from './state/auth/auth.reducers';
import { AuthEffects } from './state/auth/auth.effects';
import {
  chatChannelReducer,
  messagesReducer,
  sendMessageReducer,
} from './state/messaging/messaging.reducers';
import { MessagingEffects } from './state/messaging/messaging.effects';
import { AuthService, interceptor } from './services/auth.service';
import { MessagingService } from './services/messaging.service';
import { appReducer } from './state/app/app.reducers';
import { loginReducer } from './state/login/login.reducer';
import { LoginEffect } from './state/login/login.effect';
import { provideStoreDevtools } from '@ngrx/store-devtools';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withInterceptors([interceptor])),
    provideStore(),
    provideState('login', loginReducer),
    provideState('auth', authReducer),
    provideState('sendMessage', sendMessageReducer),
    provideState('messages', messagesReducer),
    provideState('chatChannel', chatChannelReducer),
    provideState('appState', appReducer),
    provideEffects(AuthEffects, LoginEffect, MessagingEffects),
    {
        provide: AuthService,
        useFactory: (httpClient: HttpClient) => new AuthService(httpClient),
        deps: [HttpClient],
    },
    {
        provide: MessagingService,
        useFactory: (store: Store, httpClient: HttpClient) => new MessagingService(store, httpClient),
        deps: [Store, HttpClient],
    }
],
};
