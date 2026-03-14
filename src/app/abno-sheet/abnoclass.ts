import { FirestoreDataConverter, WithFieldValue, QueryDocumentSnapshot, SnapshotOptions} from "firebase/firestore";
import { AbnoSheet } from "./abno-sheet";
import { from } from "rxjs";

export class Abnormality {
  abnoID: number;
  dmID: string[];
  icoUrl: string;
  fullName: { Name: string, Nickname: string, Code: string };
  danger: string;
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
  abnoID=0,
  dmID=['AlphaTT'],
  icoUrl="000",
  fullName={ Name: "Standard Training Dummy Rabbit", Nickname: "", Code: "0-00-00"},
  danger='TETH',
  equip:[{ imgUrl: string, Name: string }, { imgUrl: string, Name: string }, { imgUrl: string, Name: string }]=[{imgUrl: "TrainingStandardEGO", Name: "Standard Training E.G.O"},{imgUrl: "TrainingStandardEGO", Name: "Standard Training E.G.O"},{imgUrl: "TrainingStandardEGO", Name: "Standard Training E.G.O"}],
  wDam:[string, number, number]= ['Red', 1, 2],
  preferences:[{ type: string[], desc: string },{ type: string[], desc: string }]=[{type:['Attachment'], desc:"Petting, Talking, Anything works it's very friendly"},{type:['Repression'], desc:'Indifference'}],
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
    this.abnoID=abnoID;
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
    abno: number;
    dm: string[];
    ico: string;
    fName: { Name: string, Nickname: string, Code: string };
    dang: string;
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
            abno: abno.abnoID,
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
        return new Abnormality(data.abno, data.dm, data.ico, data.fName, data.dang, data.eqp, data.wDam, data.pref, data.qlip, data.eDam, data.res, data.supC, data.abs, data.trls, data.mgnt, data.stry);
    }
}
export class AbnoData{
  gameID: number;
  dmID: string[];
  abnoID: number;
  department: string;
  qClock: number;
  suppProg: number;
  trialClock: number[];
  trueName: boolean;
  clock1: [number, number];
  clock2: [number, number];
  clock3: [number, number];
  clock4: [number, number];
  constructor(
    gameID=0,
    dmID=['AlphaTT'],
    abnoID=0,
    department='Control',
    qClock=1,
    suppProg=0,
    trialClock=[0],
    trueName=false,
    clock1 :[number, number]=[3,3],
    clock2 :[number, number]=[3,3],
    clock3 :[number, number]=[6,6],
    clock4 :[number, number]=[6,6]){
      this.gameID=gameID;
      this.dmID=dmID;
      this.abnoID=abnoID;
      this.department=department;
      this.qClock=qClock;
      this.suppProg=suppProg;
      this.trialClock=trialClock;
      this.trueName=trueName;
      this.clock1=clock1;
      this.clock2=clock2;
      this.clock3=clock3;
      this.clock4=clock4;
  }
}

interface DataFS{
    game: number;
    dm: string[];
    abno: number;
    dep: string;
    qC: number;
    supP: number;
    trlC: number[];
    tN: boolean;
    c1: [number, number];
    c2: [number, number];
    c3: [number, number];
    c4: [number, number];
}

export class DataConverter implements FirestoreDataConverter<AbnoData, DataFS> {

toFirestore(data: WithFieldValue<AbnoData>): WithFieldValue<DataFS> {
    return {
        game: data.gameID,
        dm: data.dmID,
        abno: data.abnoID,
        dep: data.department,
        qC: data.qClock,
        supP: data.suppProg,
        trlC: data.trialClock,
        tN: data.trueName,
        c1: data.clock1,
        c2: data.clock2,
        c3: data.clock3,
        c4: data.clock4
    };
}

fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): AbnoData {
    const data = snapshot.data(options) as DataFS;
    return new AbnoData(data.game, data.dm, data.abno, data.dep, data.qC, data.supP, data.trlC, data.tN, data.c1, data.c2, data.c3, data.c4);
}
}

