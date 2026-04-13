import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Corridor, Department, Mapclass, Room} from './mapclass';
import { inject } from '@angular/core';
import { Sharedrules, Departments } from '../services/sharedrules';

@Component({
  selector: 'app-my-map',
  imports: [CommonModule],
  templateUrl: './my-map.html',
  styleUrl: './my-map.css',
})
export class MyMap {
//oggetto con funzioni, stati di combattimento e coordinate delle stanze
map=new Mapclass(2, [new Department(1, [new Room(0, [20,25,4,10]), new Room(0, [25,30,6,10]) ], [new Corridor(0, [16,21,6,6],), new Corridor(0,[27,27,9,15]), new Corridor(0,[26,28,14,14])], [[18,7,0]], [[17,5,1,true]], [new Corridor(0,[24,26,6,10])]), new Department(2, [new Room(1, [16,20,14,16]), new Room(1, [20,26,12,16])], [new Corridor(1, [17,17,10,15],), new Corridor(1, [13,17,15,15]),  new Corridor(1, [15,18,10,10])], [], [[17,15,0,true]], [new Corridor(1,[19,21,14,16])]), new Department(4, [new Room(1, [2,9,10,16])], [new Corridor(0, [5,5,4,9],), new Corridor(1, [9,17,12,12],)], [], [[9,13,0,false],[5,9,0,true]]), new Department(5, [new Room(1, [5,13,4,9])], [new Corridor(1, [10,19,6,6],),  new Corridor(1, [12,15,10,10]), new Corridor(1, [12,12,8,11])], [], [[17,5,0,true],[5,9,1,true]]), new Department(3, [new Room(0, [7,13,14,18])], [new Corridor(0, [12,17,15,15],), new Corridor(0, [16,16,7,16],)], [],[[9,13,1,false], [17,15,1,true]])]);
rules = inject(Sharedrules);
deps=Departments;
departments=this.map.departments;
floordisp: number = this.map.floors;
}
