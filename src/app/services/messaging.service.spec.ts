import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MessagingService } from './messaging.service';
import { Store } from '@ngrx/store';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../main';
import jasmine from 'jasmine';

describe('MessagingService', () => {
  let service: MessagingService;

  beforeEach(() => {
    initializeApp(firebaseConfig);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MessagingService,
          useFactory: (store: Store) => new MessagingService(store),
          deps: [Store]
        },
        provideMockStore({}),
      ],
    });
    service = TestBed.inject(MessagingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    
  });
});
