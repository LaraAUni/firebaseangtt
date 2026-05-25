import { Component } from '@angular/core';
import { inject } from '@angular/core';
import { Notifs } from '../notifs';

@Component({
  selector: 'app-messages',
  imports: [],
  templateUrl: './messages.html',
  styleUrl: './messages.css',
})
export class Messages {
  notifs=inject(Notifs);
}
