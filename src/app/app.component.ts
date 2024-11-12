import { Component, OnInit } from '@angular/core';
import { NavigationEnd, NavigationStart, Route, Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { getCurrentLoggedInUser } from './state/auth/auth.actions';
import { selectCurrentLoggedInUser } from './state/auth/auth.selectors';
import { User } from './model/user';
import { AuthService } from './services/auth.service';
import { getCurrentUser } from './model/get-current-user';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatListModule,
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  host: {
    '(window:resize)': 'onResize($event)',
  },
})
export class AppComponent implements OnInit {
  title = 'chat';

  constructor(
    private store: Store,
    private authService: AuthService,
    private router: Router
  ) {}

  currentUser: User | undefined;

  openSide: boolean = false;

  mode: MatDrawerMode = 'side';

  isLoginOrSignupRoute: boolean = false;

  ngOnInit(): void {

    this.store.select(selectCurrentLoggedInUser).subscribe((result) => {
      this.currentUser = result;
    });

    this.router.events.subscribe(val => {
      if (val instanceof NavigationStart) {
        if(val.url === '/login' || val.url === '/signup'){
          this.isLoginOrSignupRoute = true;
        }else{
          this.isLoginOrSignupRoute = false;
        }
      }
    })

  }

 

  onResize(event: Event) {
    // @ts-ignore
    if (event.target.innerWidth <= 600) {
      this.mode = 'over';
    } else {
      this.mode = 'side';
    }
  }

  logout() {
    localStorage.clear();
    this.authService.logout();
    if (localStorage.length === 0) {
      this.router.navigate(['/login']);
      this.openSide = false;
    }
  }
}
