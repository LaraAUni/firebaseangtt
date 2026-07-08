import { WithFieldValue, QueryDocumentSnapshot, SnapshotOptions, FirestoreDataConverter } from 'firebase/firestore';

export class Iconsclass{ //???? Non va???
    dep0: {id: number, name: string, icon: string}[];
    dep1: {id: number, name: string, icon: string}[];
    dep2: {id: number, name: string, icon: string}[];
    dep3: {id: number, name: string, icon: string}[];
    dep4: {id: number, name: string, icon: string}[];
    dep5: {id: number, name: string, icon: string}[];
    reserves: {id: number, name: string, icon: string}[]; //massimo 6 dipartmenti ma serve per riserve e morti
    dead: {id: number, name: string, icon: string}[];
      constructor(
      dep0:{id: number, name: string, icon: string}[]=[],dep1:{id: number, name: string, icon: string}[]=[], dep2:{id: number, name: string, icon: string}[]=[],
      dep3:{id: number, name: string, icon: string}[]=[], dep4:{id: number, name: string, icon: string}[]=[],
      dep5:{id: number, name: string, icon: string}[]=[],
      reserves:{id: number, name: string, icon: string}[]=[], dead:{id: number, name: string, icon: string}[]=[]){
      {
      console.log("List to create: ", dep1, dep2, dep3, dep4, dep5, reserves, dead);
      this.dep0=dep0;
      this.dep1=dep1;
      this.dep2=dep2;
      this.dep3=dep3;
      this.dep4=dep4;
      this.dep5=dep5;
      this.reserves=reserves;
      this.dead=dead;
      console.log("List created: ", this.dep1, this.dep2, this.dep3, this.dep4, this.dep5, this.reserves, this.dead);
    }
}
}

interface iListFS{
    dep0: {id: number, name: string, icon: string}[];
    dep1: {id: number, name: string, icon: string}[];
    dep2: {id: number, name: string, icon: string}[];
    dep3: {id: number, name: string, icon: string}[];
    dep4: {id: number, name: string, icon: string}[];
    dep5: {id: number, name: string, icon: string}[];
    reserves: {id: number, name: string, icon: string}[];
    dead: {id: number, name: string, icon: string}[];
}


export class listConverter implements FirestoreDataConverter<Iconsclass, iListFS> {
  toFirestore(icon: WithFieldValue<Iconsclass>) : WithFieldValue<iListFS> {
    return {
      dep0: icon.dep3,
      dep1: icon.dep1,
      dep2: icon.dep2,
      dep3: icon.dep3,
      dep4: icon.dep1,
      dep5: icon.dep2,
      reserves: icon.dep2,
      dead: icon.dep3,
    };
  }
  fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Iconsclass {
      const data = snapshot.data(options) as iListFS;
      return new Iconsclass( data.dep0, data.dep1, data.dep2, data.dep3, data.dep4, data.dep5, data.reserves, data.dead);
  }
}