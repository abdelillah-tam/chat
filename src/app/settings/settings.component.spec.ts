import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { SettingsComponent } from './settings.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { By } from '@angular/platform-browser';
import {
  selectCurrentLoggedInUser,
  selectState,
} from '../state/auth/auth.selectors';
import { DefaultProjectorFn, MemoizedSelector } from '@ngrx/store';
import { User } from '../model/user';

describe('SettingsComponent', () => {
  let component: SettingsComponent;
  let fixture: ComponentFixture<SettingsComponent>;
  let store: MockStore;
  let mockSelectCurrentLoggedInUser: MemoizedSelector<
    any,
    User | undefined,
    DefaultProjectorFn<User | undefined>
  >;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SettingsComponent],
      providers: [
        provideMockStore({
          selectors: [
            {
              selector: selectState,
              value: {
                newProfilePictureUrl: 'link.com',
              },
            },
          ],
        }),
        provideAnimationsAsync(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    store = TestBed.inject(MockStore);
    mockSelectCurrentLoggedInUser = store.overrideSelector(
      selectCurrentLoggedInUser,
      {
        email: 'a@a.com',
        firstName: 'Abdelillah',
        lastName: 'Tamoussat',
        objectId: 'id',
        profileImageLink: 'link.com',
        provider: 'google',
        sex: 'man',
      }
    );
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call onImageAdded when changing input element', () => {
    let inputDe = fixture.debugElement.query(By.css('#profile-picture'));

    let onImageAddedSpy = spyOn(fixture.componentInstance, 'onImageAdded');

    let event = {
      target: {
        files: [new File([''], 'image.png')],
      },
    };

    inputDe.triggerEventHandler('change', event);

    expect(onImageAddedSpy).toHaveBeenCalledWith(event);
  });

  it('should form group be valid', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance.infoGroup.valid).toBeTrue();
  });

  it('should form controller be false if email is not valid', () => {
    mockSelectCurrentLoggedInUser.setResult({
      email: 'a@a.com',
      firstName: 'Mohamed',
      lastName: 'Tamoussat',
      objectId: 'id',
      profileImageLink: 'link.com',
      provider: 'backendless',
      sex: 'man',
    });
    store.refreshState();

    fixture.detectChanges();

    fixture.componentInstance.infoGroup.controls.email.setValue('a');
    
    expect(fixture.componentInstance.infoGroup.valid).toBeFalse();
  });

  it('should email and password be disabled', () => {
    fixture.detectChanges();
    expect(fixture.componentInstance.infoGroup.controls.email.disabled).toBe(
      true
    );
    expect(fixture.componentInstance.infoGroup.controls.password.disabled).toBe(
      true
    );
  });

  it('should click on Save button and saveProfilePictureChange be called', () => {
    let file = new File([''], 'image.png');
    fixture.componentInstance.file = file;

    let saveProfilePictureChangeSpy = spyOn(
      fixture.componentInstance,
      'saveProfilePictureChange'
    );

    let saveBtn = fixture.debugElement.query(By.css('button'));

    saveBtn.triggerEventHandler('click');

    expect(saveProfilePictureChangeSpy).toHaveBeenCalled();
  });
});
