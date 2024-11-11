import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { Store } from '@ngrx/store';
import { selectChat } from '../state/messaging/messaging.selectors';
import { checkIfTokenIsValidAction } from '../state/auth/auth.actions';
import { selectTokenValidation } from '../state/auth/auth.selectors';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatMenuModule } from '@angular/material/menu';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { getCurrentUser } from '../model/get-current-user';

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
export class HomeComponent implements OnInit {
  constructor(private router: Router, private store: Store) {
    if (
      localStorage.getItem('email') === null ||
      localStorage.getItem('userToken') === null ||
      localStorage.getItem('objectId') === null
    ) {
      this.router.navigate(['/login']);
    } else {
      this.store.dispatch(
        checkIfTokenIsValidAction({ token: localStorage.getItem('userToken')! })
      );

      this.store.select(selectTokenValidation).subscribe((valid) => {
        if (valid !== undefined && !valid) {
          this.router.navigate(['/login']);
        }
      });
    }
  }

  ngOnInit(): void {
    getCurrentUser(this.store);
    this.store.select(selectChat).subscribe((result) => {
      if (result) {
        this.router.navigate(['/chat']);
      }
    });
  }
}
