import { Component, ChangeDetectionStrategy } from '@angular/core';
import { inject } from '@angular/core';
import { Notifs } from '../services/notifs';
@Component({
  selector: 'app-messages',
  imports: [],
  templateUrl: './messages.html',
  changeDetection: ChangeDetectionStrategy.Default,
  styleUrl: './messages.css',
})
export class Messages {
  notifs=inject(Notifs);
}
