import { Component, OnInit } from '@angular/core';
import {
  NavigationEnd,
  NavigationStart,
  Route,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatDrawerMode, MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { Store } from '@ngrx/store';
import { emptyStateAction } from './state/auth/auth.actions';
import { AuthService } from './services/auth.service';
import { getCurrentUser } from './model/get-current-user';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs';
import { sideNavStateSelector } from './state/app/app.selectors';

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
    RouterLinkActive,
    CommonModule,
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

  openSide: boolean = false;

  mode: MatDrawerMode = 'side';

  selectedSection = 0;

  isLoginOrSignupRoute: boolean = false;

  ngOnInit(): void {
    this.store.select(sideNavStateSelector).subscribe((result) => {
      this.openSide = result;
    });
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((result) => {
        if (result.url === '/') {
          this.select(0);
        } else if (result.url === '/settings') {
          this.select(1);
        }
      });

    this.router.events.subscribe((val) => {
      if (val instanceof NavigationStart) {
        if (val.url === '/login' || val.url === '/signup') {
          this.isLoginOrSignupRoute = true;
        } else {
          this.isLoginOrSignupRoute = false;
        }
      }
    });
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
    this.store.dispatch(emptyStateAction());
    if (localStorage.length === 0) {
      this.router.navigate(['/login']);
      this.openSide = false;
    }
  }

  select(index: number) {
    this.selectedSection = index;
    this.router.navigate([this.selectedSection === 0 ? '/' : '/settings']);
  }
}
