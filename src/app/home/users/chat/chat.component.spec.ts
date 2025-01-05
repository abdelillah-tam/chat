import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideMockStore } from '@ngrx/store/testing';
import { ChatComponent } from './chat.component';
import { provideRouter } from '@angular/router';
import { routes } from '../../../app.routes';
import {
  selectImageMsgUrl,
  selectMessages,
} from '../../../state/messaging/messaging.selectors';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  selectCurrentLoggedInUser,
  selectUser,
} from '../../../state/auth/auth.selectors';
import { By } from '@angular/platform-browser';

describe('ChatComponent', () => {
  let component: ChatComponent;
  let fixture: ComponentFixture<ChatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectImageMsgUrl,
              value: 'url',
            },
            {
              selector: selectMessages,
              value: [
                {
                  messageText: 'message',
                  senderId: 'senderId',
                  receiverId: 'receiverId',
                  timestamp: '1735080564',
                  type: 'image',
                  imageUrl: 'url',
                },
                {
                  messageText: 'message',
                  senderId: 'senderId',
                  receiverId: 'receiverId',
                  timestamp: '1735080564',
                  type: 'image',
                  imageUrl: 'url',
                },
              ],
            },
            {
              selector: selectCurrentLoggedInUser,
              value: {},
            },
            {
              selector: selectImageMsgUrl,
              value: {},
            },
            {
              selector: selectUser,
              value: {},
            },
          ],
        }),
        provideRouter(routes),
        provideAnimationsAsync(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ChatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should messages array contains one message item', async () => {
    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.messages.length).toEqual(2);
  });

  it('should have sender user', () => {
    expect(component.senderUser).toBeTruthy();
  });

  it('should have receiver user', () => {
    expect(component.receiverUser).toBeTruthy();
  });

  it('should call onImageAdded and file not to be null when change event occurs on input', async () => {
    let de = fixture.debugElement.query(By.css('input:not([matInput])'));

    spyOn(component, 'onImageAdded').and.callThrough();

    de.triggerEventHandler('change', {
      target: {
        files: [new File([''], 'filename.jpg', { type: 'image/*' })],
      },
    });

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.onImageAdded).toHaveBeenCalled();
    expect(component.file).toBeTruthy();
    
  });
});
