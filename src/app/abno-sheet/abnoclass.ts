import { FirestoreDataConverter, WithFieldValue, QueryDocumentSnapshot, SnapshotOptions} from "firebase/firestore";

export class Abnormality {
  dmID: string[];
  icoUrl: string;
  fullName: { Name: string, Nickname: string, Code: string };
  danger: number;
  equip: [{ imgUrl: string, Name: string }, { imgUrl: string, Name: string }, { imgUrl: string, Name: string }];
  wDam: [string, number, number];
  preferences: [{ type: string[], desc: string },{ type: string[], desc: string }];
  qlipoth: number;
  eDam:[string,number,number];
  resistances: [number, number, number, number];
  suppClock: number;
  abilities: string[];
  trials: { Name: string, Clock: number, Effect: string, Desc: string }[];
  management: string[];
  story: string[];
constructor(
  dmID=['AlphaTT'],
  icoUrl="000",
  fullName={ Name: "Standard Training Dummy Rabbit", Nickname: "", Code: "0-00-00"},
  danger=2,
  equip:[{ imgUrl: string, Name: string }, { imgUrl: string, Name: string }, { imgUrl: string, Name: string }]=[{imgUrl: "TrainingStandardEGO", Name: "Standard Training E.G.O"},{imgUrl: "TrainingStandardEGO", Name: "Standard Training E.G.O"},{imgUrl: "TrainingStandardEGO", Name: "Standard Training E.G.O"}],
  wDam:[string, number, number]= ['Red', 1, 2],
  preferences:[{ type: string[], desc: string },{ type: string[], desc: string }]=[{type:['Attachment', 'Insight'], desc:"Petting, Talking, Anything works it's very friendly"},{type:['Repression'], desc:'Indifference'}],
  qlipoth=1,
  eDam:[string,number,number]=['Red',1,2],
  resistances:[number, number, number, number]=[0.5,1.5,1,1],
  suppClock=2, //suppression Clock (HP)
  abilities=['---'],
  trials=[{Name: "Trial 1", Clock: 4, Effect: "Effect of Trial 1", Desc: "Description of Trial 1"}],
  management=['When Repression work was performed with Standard Training-Dummy Rabbit, the Qliphoth Counter lowered.'],
  story=["An Abnormality in the shape of a training dummy used to train up-and-coming managers.", "Rumor has it this Abnormality was chosen to be used for training as it is the most docile and tame of any that we have extracted. It’s called a training dummy “rabbit”, but it doesn’t seem to enjoy carrots. It likes people. If it escapes, it is merely following the employee as they leave its Containment Unit."],
)
  {
    this.dmID=dmID;
    this.icoUrl=icoUrl;
    this.fullName=fullName;
    this.danger=danger;
    this.equip=equip;
    this.wDam=wDam;
    this.preferences=preferences;
    this.qlipoth=qlipoth;
    this.eDam=eDam;
    this.resistances=resistances;
    this.suppClock=suppClock;
    this.abilities=abilities;
    this.trials=trials;
    this.management=management;
    this.story=story;
  }
}

interface AbnoFS{
    dm: string[];
    ico: string;
    fName: { Name: string, Nickname: string, Code: string };
    dang: number;
    eqp: [{ imgUrl: string, Name: string }, { imgUrl: string, Name: string }, { imgUrl: string, Name: string }];
    wDam: [string, number, number];
    pref: [{ type: string[], desc: string },{ type: string[], desc: string }];
    qlip: number;
    eDam:[string,number,number];
    res: [number, number, number, number];
    supC: number;
    abs: string[];
    trls: { Name: string, Clock: number, Effect: string, Desc: string }[];
    mgnt: string[];
    stry: string[];
}


export class AbnoConverter implements FirestoreDataConverter<Abnormality, AbnoFS> {
    toFirestore(abno: WithFieldValue<Abnormality>): WithFieldValue<AbnoFS> {
        return {
            dm: abno.dmID,
            ico: abno.icoUrl,
            fName: abno.fullName,
            dang: abno.danger,
            eqp: abno.equip,
            wDam: abno.wDam,
            pref: abno.preferences,
            qlip: abno.qlipoth,
            eDam: abno.eDam,
            res: abno.resistances,
            supC: abno.suppClock,
            abs: abno.abilities,
            trls: abno.trials,
            mgnt: abno.management,
            stry: abno.story

        };
    }
    
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Abnormality {
        const data = snapshot.data(options) as AbnoFS;
        return new Abnormality(data.dm, data.ico, data.fName, data.dang, data.eqp, data.wDam, data.pref, data.qlip, data.eDam, data.res, data.supC, data.abs, data.trls, data.mgnt, data.stry);
    }
}
export class AbnoData{
  dmID: string[];
  department: number;
  qClock: number;
  suppProg: number;
  trialClock: number[];
  trueNameRev: boolean;
  clock1: [number, number];
  clock2: [number, number];
  clock3: [number, number];
  clock4: [number, number];
  mapCoord : [number, number, number]; //x,y,floor
  constructor(
    dmID=['AlphaTT'],
    department=0,
    qClock=1,
    suppProg=0,
    trialClock=[0],
    trueNameRev=false,
    clock1 :[number, number]=[0,3], //orologi di ricerca e custom rules su cosa rivelano incluso true/false per confermare di poterle rivelare perché potrebbero inserirlo per sbaglio
    clock2 :[number, number]=[0,3],
    clock3 :[number, number]=[0,6],
    clock4 :[number, number]=[0,6],
    mapCoord:[number, number, number]=[0, 0, 0],){
      this.dmID=dmID;
      this.department=department;
      this.qClock=qClock;
      this.suppProg=suppProg;
      this.trialClock=trialClock;
      this.trueNameRev=trueNameRev;
      this.clock1=clock1;
      this.clock2=clock2;
      this.clock3=clock3;
      this.clock4=clock4;
      this.mapCoord=mapCoord;
  }
}

interface DataFS{
    dm: string[];
    dep: number;
    qC: number;
    supP: number;
    trlC: number[];
    tN: boolean;
    c1: [number, number];
    c2: [number, number];
    c3: [number, number];
    c4: [number, number];
    mapC: [number, number, number];
}

export class DataConverter implements FirestoreDataConverter<AbnoData, DataFS> {

toFirestore(data: WithFieldValue<AbnoData>): WithFieldValue<DataFS> {
    return {
        dm: data.dmID,
        dep: data.department,
        qC: data.qClock,
        supP: data.suppProg,
        trlC: data.trialClock,
        tN: data.trueNameRev,
        c1: data.clock1,
        c2: data.clock2,
        c3: data.clock3,
        c4: data.clock4,
        mapC: data.mapCoord
    };
}

fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): AbnoData {
    const data = snapshot.data(options) as DataFS;
    return new AbnoData(data.dm, data.dep, data.qC, data.supP, data.trlC, data.tN, data.c1, data.c2, data.c3, data.c4, data.mapC);
}
}

