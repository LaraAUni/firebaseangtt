import { WithFieldValue, QueryDocumentSnapshot, SnapshotOptions, FirestoreDataConverter } from 'firebase/firestore';
export class Iconsclass{ //???? Non va???
    dep1?: {id: number, name: string, icon: string}[];
    dep2?: {id: number, name: string, icon: string}[];
    dep3?: {id: number, name: string, icon: string}[];
    dep4?: {id: number, name: string, icon: string}[];
    dep5?: {id: number, name: string, icon: string}[];
    dep6?: {id: number, name: string, icon: string}[];
    dep7?: {id: number, name: string, icon: string}[]; //massimo 6 dipartmenti ma serve per riserve e morti
    dep8?: {id: number, name: string, icon: string}[];
    constructor(list:{id: number, name: string, icon: string}[][]=[]) {
      let len=list.length;
      console.log("List to create: ", list);
      let newList: {id: number, name: string, icon: string}[][] = [];
      newList=list.slice();
      switch(len){
        case 8: this.dep8=list[7];
        case 7: this.dep7=list[6];
        case 6: this.dep6=list[5];
        case 5: this.dep5=list[4];
        case 4: this.dep4=list[3];
        case 3: this.dep3=list[2];
        case 2: this.dep2=list[1];
        case 1: this.dep1=list[0];
        default: break;
      }
    }
}

interface iListFS{
    dep1?: {id: number, name: string, icon: string}[];
    dep2?: {id: number, name: string, icon: string}[];
    dep3?: {id: number, name: string, icon: string}[];
    dep4?: {id: number, name: string, icon: string}[];
    dep5?: {id: number, name: string, icon: string}[];
    dep6?: {id: number, name: string, icon: string}[];
    dep7?: {id: number, name: string, icon: string}[];
    dep8?: {id: number, name: string, icon: string}[];
}


export class listConverter implements FirestoreDataConverter<Iconsclass, iListFS> {
  toFirestore(icon: WithFieldValue<Iconsclass>) : WithFieldValue<iListFS> {
    let res: WithFieldValue<iListFS> = {};
    let len=0;
    for(var prop in icon){
      if(icon[prop as keyof Iconsclass]==undefined) continue;
      len++;
    }
    switch(len){
      case 8: (icon.dep8 ? res.dep8=icon.dep8 : res.dep8=[]);
      case 7: (icon.dep7 ? res.dep7=icon.dep7 : res.dep7=[]);
      case 6: (icon.dep6 ? res.dep6=icon.dep6 : res.dep6=[]);
      case 5: (icon.dep5 ? res.dep5=icon.dep5 : res.dep5=[]);
      case 4: (icon.dep4 ? res.dep4=icon.dep4 : res.dep4=[]);
      case 3: (icon.dep3 ? res.dep3=icon.dep3 : res.dep3=[]);
      case 2: (icon.dep2 ? res.dep2=icon.dep2 : res.dep2=[]);
      case 1: (icon.dep1 ? res.dep1=icon.dep1 : res.dep1=[]);
      default: break;
    }
    return res;
  }
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Iconsclass {
      const data = snapshot.data(options) as iListFS;
      let res = [ data.dep1 ?? [], data.dep2 ?? [], data.dep3 ?? [], data.dep4 ?? [], data.dep5 ?? [], data.dep6 ?? [], data.dep7 ?? [], data.dep8 ?? [] ];
      return new Iconsclass(res);
  }
}