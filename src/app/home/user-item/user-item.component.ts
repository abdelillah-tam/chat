import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { User } from '../../model/user';

@Component({
  selector: 'app-user-item',
  templateUrl: './user-item.component.html',
  styleUrl: './user-item.component.css',
  imports: [
    CommonModule
  ],
  standalone: true
})
export class UserItemComponent {
  index = input<number>();
  user = input<User>();
  selectedUserIndex = input<number>();
}
