import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Corridor, Department, Mapclass, Room} from './mapclass';
import { inject } from '@angular/core';
import { Sharedrules } from '../services/sharedrules';

@Component({
  selector: 'app-my-map',
  imports: [CommonModule],
  templateUrl: './my-map.html',
  styleUrl: './my-map.css',
})
export class MyMap {
//oggetto con funzioni, stati di combattimento e coordinate delle stanze
map=new Mapclass(2, [new Department('Control', [new Room(0, [14,18,6,10]), new Room(0, [10,15,4,10])], [new Corridor(0, [4,14,6,6],)], [[7,4,1]], [[5,5,1,true]]), new Department('Information', [new Room(1, [16,18,14,16])], []), new Department('Training', [new Room(1, [2,9,10,16])], [], [], [[9,13,0,false]]), new Department('Disciplinary', [new Room(1, [2,9,6,10])], [], [], [[5,5,0,true]]), new Department('Safety', [new Room(0, [7,13,14,18])], [], [],[[9,13,1,false]])]);
floordisp: number = 0; //va tolto comunque Hide perché non si vedono i piani di sotto aaaahhh
rules = inject(Sharedrules);
departments=this.map.departments;
}
