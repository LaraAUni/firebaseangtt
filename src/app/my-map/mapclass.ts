import { inject } from "@angular/core";
import { Sharedrules } from "../services/sharedrules";
import { FirestoreDataConverter, WithFieldValue, QueryDocumentSnapshot, SnapshotOptions} from "firebase/firestore";

export class Mapclass {
  floors: number = 1;
  departments: Department[] = [];
  constructor(floors: number, departments: Department[]) {
    this.floors = floors;
    this.departments = departments;
  }
}
export class Department {
  rules = inject(Sharedrules);

  rooms: Room[] = [];
  corridors: Corridor[] = [];
  department: number = 0;
  background: string = '--Bonus-color';
  abnorooms: [number, number, number][] = [];
  stairs: [number, number, number, boolean][] = []; //x,y, floor, stair/elevator
  connectors: Corridor[] = []; //per le parti da colorare tra le stanze senza contarle come stanze per il movimento
  depColor(c:number){
    return this.rules.depColorUp(c)[0] as string;
  }
  constructor(department: number, rooms: Room[], corridors: Corridor[], abnorooms: [number, number, number][] = [], stairs: [number, number, number, boolean][] = [], connectors:Corridor[] = []) {
    this.department = department;
    this.rooms = rooms;
    this.corridors = corridors;
    this.stairs = stairs;
    this.abnorooms = abnorooms;
    this.background = this.depColor(department);
    this.connectors = connectors;
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
export class Room extends Corridor { //in caso devo aggiungere qualcosa che non è nei corridoi
  constructor(floor: number = 0, placement: [number, number, number, number]) {
    super(floor, placement);
  }
}


interface MapFS{
    flrs: number;
    departments: number[];
    rooms: Room[][];
    corridors: Corridor[][];
    abnorooms: [number, number, number][][];
    stairs: [number, number, number, boolean][][];
    connectors: Corridor[][];
}
export class MapConverter implements FirestoreDataConverter<Mapclass, MapFS> {
      rules= inject(Sharedrules);
      depNum=this.rules.depsList.length;
    toFirestore(map: WithFieldValue<Mapclass>): WithFieldValue<MapFS> {
      const departments = map.departments as Department[];
      let deps: number[] = Array(this.depNum).fill(0);
      for(let i=0; i<this.depNum; i++){
        deps[i]=departments[i].department;
      }
      let rooms: Room[][]=Array(this.depNum).fill([]);
      for(let i=0; i<this.depNum; i++){
        rooms[i]=departments[i].rooms;
      }
      let corridors: Corridor[][]=Array(this.depNum).fill([]);
      for(let i=0; i<this.depNum; i++){
        corridors[i]=departments[i].corridors;
      }
      let abnorooms: [number, number, number][][]=Array(this.depNum).fill([]);
      for(let i=0; i<this.depNum; i++){
        abnorooms[i]=departments[i].abnorooms;
      }
      let stairs: [number, number, number, boolean][][]=Array(this.depNum).fill([]);
      for(let i=0; i<this.depNum; i++){
        stairs[i]=departments[i].stairs;
      }
      let connectors: Corridor[][]=Array(this.depNum).fill([]);
      for(let i=0; i<this.depNum; i++){
        connectors[i]=departments[i].connectors;
      }
        return {
            flrs: map.floors,
            departments: deps,
            rooms: rooms,
            corridors: corridors,
            abnorooms: abnorooms,
            stairs: stairs,
            connectors: connectors
        };
}
    
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Mapclass {
        const data = snapshot.data(options) as MapFS;
        let map=new Mapclass(data.flrs, []);
        map.departments=Array(this.depNum).fill(new Department(0, [], []));
        for(let i=0; i<this.depNum; i++){
          map.departments[i]=new Department(data.departments[i], data.rooms[i], data.corridors[i], data.abnorooms[i], data.stairs[i], data.connectors[i]);
        }
        return map;
    }
}