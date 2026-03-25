import { inject } from "@angular/core";
import { Sharedrules } from "../services/sharedrules";


export class Mapclass {
  floors: number = 1;
  departments: Department[] = [];
  constructor(floors: number, departments: Department[]) {
    this.floors = floors;
    this.departments = departments;
  }
}
export class Department {
  injectedRules = inject(Sharedrules);
  rooms: Room[] = [];
  corridors: Corridor[] = [];
  department: number = 0;
  background: string = '--bonusdep-color';
  abnorooms: [number, number, number][] = [];
  stairs: [number, number, number, boolean][] = []; //x,y, floor, stair/elevator
  depColor(c:number){
    return this.injectedRules.depColorUp(c)[0] as string;
  }
  constructor(department: number, rooms: Room[], corridors: Corridor[], abnorooms: [number, number, number][] = [], stairs: [number, number, number, boolean][] = []) {
    this.department = department;
    this.rooms = rooms;
    this.corridors = corridors;
    this.stairs = stairs;
    this.abnorooms = abnorooms;
    this.background = this.depColor(department);
  }
}
export class Corridor {
  placement: [number, number, number, number] = [0, 0, 0, 0]; //x1,x2,y1,y2
  floor: number = 0;
  constructor(floor: number = 0, placement: [number, number, number, number]) {
    this.placement = placement;
    this.floor = floor;
  }
}
export class Room extends Corridor {
  constructor(floor: number = 0, placement: [number, number, number, number]) {
    super(floor, placement);
  }
}