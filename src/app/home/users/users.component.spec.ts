import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersComponent } from './users.component';
import {
  MessagingService,
  MockMessagingService,
} from '../../services/messaging.service';
import { provideMockStore } from '@ngrx/store/testing';
import { provideRouter, Router } from '@angular/router';
import { routes } from '../../app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { selectUsers } from '../../state/auth/auth.selectors';
import { User } from '../../model/user';
import { By } from '@angular/platform-browser';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';

describe('UsersComponent', () => {
  let component: UsersComponent;
  let fixture: ComponentFixture<UsersComponent>;
  let mockUser: User;
  let router: Router;
  let loader: HarnessLoader;

  beforeEach(async () => {
    mockUser = {
      firstName: 'Abdelillah',
      lastName: 'Tamoussat',
      email: 'atamossat@gmail.com',
      objectId: 'id',
      profileImageLink: 'link',
      provider: 'google',
      sex: 'man',
    };
    await TestBed.configureTestingModule({
      imports: [UsersComponent],
      providers: [
        {
          provide: MessagingService,
          useClass: MockMessagingService,
        },
        provideMockStore({
          selectors: [
            {
              selector: selectUsers,
              value: [mockUser],
            },
          ],
        }),
        provideRouter(routes),
        provideAnimationsAsync(),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(UsersComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should users list not to be empty', () => {
    expect(component.users.length).toBeTruthy();
  });

  it('should click on user item and call openChatWindow fun', async () => {
    spyOn(component, 'openChatWindow').and.callThrough();

    await fixture.whenStable();

    let userItemDe = fixture.debugElement.query(By.css('.user-item'));

    userItemDe.triggerEventHandler('click');

    expect(component.openChatWindow).toHaveBeenCalledWith(mockUser.objectId, 0);
  });

  it('should change searchInput with input element value and call findUsers function', async () => {
    await fixture.whenStable();

    spyOn(component, 'findUsers');

    let input = await loader.getHarness(MatInputHarness);

    await input.setValue('jdily');

    fixture.detectChanges();
    await fixture.whenStable();

    expect(component.searchInput).toBe(await input.getValue());
    expect(component.findUsers).toHaveBeenCalled();
  });
});
