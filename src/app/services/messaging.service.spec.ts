import { TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { MessagingService } from './messaging.service';
import { Store } from '@ngrx/store';
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from '../../main';
import {
  getDownloadURL,
  getStorage,
  ref as stRef,
  uploadBytes,
} from 'firebase/storage';
import { DataSnapshot, getDatabase, ref, get } from 'firebase/database';
import jasmine from 'jasmine';

describe('MessagingService', () => {
  let service: MessagingService;
  let dbMock;

  beforeEach(() => {
    initializeApp(firebaseConfig);
    TestBed.configureTestingModule({
      providers: [
        {
          provide: MessagingService,
          useFactory: () => new MessagingService(),
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
