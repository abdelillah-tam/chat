import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  NavigationEnd,
  Router,
  RouterLink,
  RouterOutlet,
} from '@angular/router';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { checkIfTokenIsValidAction } from '../state/auth/auth.actions';
import { selectTokenValidation } from '../state/auth/auth.selectors';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { filter, Subscriber, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    CommonModule,
    MatListModule,
    MatToolbarModule,
    MatMenuModule,
    MatSidenavModule,
    MatIconModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  selectToken: Subscription | undefined;

  constructor(private router: Router, private store: Store) {}

  ngOnInit(): void {
    if (
      !localStorage.getItem('email') ||
      !localStorage.getItem('userToken') ||
      !localStorage.getItem('objectId')
    ) {
      this.router.navigate(['/login']);
    } else {
      this.store.dispatch(
        checkIfTokenIsValidAction({ token: localStorage.getItem('userToken')! })
      );

      this.selectToken = this.store
        .select(selectTokenValidation)
        .subscribe((valid) => {
          if (valid !== undefined && !valid) {
            this.router.navigate(['/login']);
          }
        });
    }
  }

  ngOnDestroy(): void {
    this.selectToken?.unsubscribe();
  }
}
