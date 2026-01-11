import { Component } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-chara-sheet',
  imports: [NgTemplateOutlet, RouterOutlet],
  templateUrl: './chara-sheet.html',
  styleUrl: './chara-sheet.css',
})
export class CharaSheet {

}
