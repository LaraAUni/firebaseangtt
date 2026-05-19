import { Departments } from './services/sharedrules';
import { FirestoreDataConverter, WithFieldValue, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export class Rules {
      gameID:number = 0;
      gameName:string = '';
      DMIds: string[] = [];  //Meglio mettere gameID nell'account insieme alla lingua per cercarli, ma serve permesso da DM
      charaList:number[] = [];//id personaggi
      deadCh:number[] = [];
      abnoList:number[] = [];//le Abno avranno una lista di base ma poi devono avere la exp memorizzata a parte quindi tanto vale avere una scheda nuova
      depsList:Departments[] = []; //ENUM
      bonusDeps:string[]=[];
      bonusColors:[string,boolean][]=[];//da usare per bonusDeps e customDeps, se si aggiungono altri bonusDeps o customDeps basta aggiungerli qui, bool è per testo bianco o nero
      capPassive: string[] = [];
      controlAbs: string[] = [];
      infoAbs: string[] = [];
      safetyAbs: string[] = [];
      trainAbs: string[] = [];
      discAbs: string[] = [];
      centralAbs: string[] = [];
      welfareAbs: string[] = [];
      recordsAbs: string[] = [];
      extractAbs: string[] = [];
      architAbs: string[] = [];
      bonus1Abs: string[] = [];
      bonus2Abs: string[] = [];
      bonus3Abs: string[] = [];
      bonus4Abs: string[] = [];
      bonus5Abs: string[] = [];
      bonus6Abs: string[] = [];
      agentAbs: string[] = [];
      traumas: string[] = [];
      traum3nabled=false; //per il progetto che dà un'altro slot se completato
      constructor(
      gameID: number = 0,
      gameName: string = '',
      DMIds: string[] = [],
      charaList: number[] = [],
      deadCh: number[] = [],
      abnoList: number[] = [],//le Abno avranno una lista di base ma poi devono avere la exp memorizzata a parte quindi tanto vale avere una scheda nuova
      depsList: Departments[] = [Departments.Control, Departments.Information, Departments.Safety, Departments.Training, Departments.Disciplinary], //ENUM
      bonusDeps: string[]=[],
      bonusColors: [string,boolean][]=[],//da usare per bonusDeps e customDeps, se si aggiungono altri bonusDeps o customDeps basta aggiungerli qui, bool è per testo bianco o nero
      capPassive=["Manager, Shut It Down!", "Solo Research", "Containment Protocols", "Shadow", "Rabbit Protocol","---","---","---","---","---","---","---","---","---","---","---"],
      controlAbs=["Corrective Action", "Controlling Coordinator", "Cross-Departmental Efficiency", "The Will To Stand Up Straight"],
      infoAbs=["Foresight","Respectful Distance","Don't Act Rashly","The Rationality to Maintain Discretion"],
      safetyAbs=["Dead Man Walking", "Bedside Manners", "Not On My Watch", "The Fearlessness to Keep On Living"],
      trainAbs=["Sink or Swim", "Right Out of the Handbook", "Stick to the Plan!", "The Hope to Be a Better Person"],
      discAbs=["Big EGO", "Pain Bringer", "Vitality", "The Courage to Protect"],
      centralAbs=["---"], //reskin di Control
      welfareAbs=["---"], //Al momento è solo per reskin di Safety
      recordsAbs=["---"], //reskin di Information
      extractAbs=["---"], //reskin di Disciplinary
      architAbs=["---"], //reskin di Training
      bonus1Abs=["---"],
      bonus2Abs=["---"],
      bonus3Abs=["---"],
      bonus4Abs=["---"],
      bonus5Abs=["---"],
      bonus6Abs=["---"],
      agentAbs=["Unassuming","Temporary Lucidity", "Face the Fear", "Virtuous", "Skilled"],
      traumas=["Cold","Haunted","Obsessed","Distrustful","Reckless","Soft","Volatile","Vicious"],
      traum3nabled=false){
            this.gameID=gameID;
            this.gameName=gameName;
            this.DMIds=DMIds;
            this.charaList=charaList;
            this.deadCh=deadCh;
            this.abnoList=abnoList;
            this.depsList=depsList;
            this.bonusDeps=bonusDeps;
            this.bonusColors=bonusColors;
            this.capPassive=capPassive;
            this.controlAbs=controlAbs;
            this.infoAbs=infoAbs;
            this.safetyAbs=safetyAbs;
            this.trainAbs=trainAbs;
            this.discAbs=discAbs;
            this.centralAbs=centralAbs;
            this.welfareAbs=welfareAbs;
            this.recordsAbs=recordsAbs;
            this.extractAbs=extractAbs;
            this.architAbs=architAbs;
            this.bonus1Abs=bonus1Abs;
            this.bonus2Abs=bonus2Abs;
            this.bonus3Abs=bonus3Abs;
            this.bonus4Abs=bonus4Abs;
            this.bonus5Abs=bonus5Abs;
            this.bonus6Abs=bonus6Abs;
            this.agentAbs=agentAbs;
            this.traumas=traumas;
            this.traum3nabled=traum3nabled;
      }
}

interface rulesFS{
      gameID:number;
      gameName:string;
      DMIds: string[];
      charaList:number[];
      deadCh:number[];
      abnoList:number[];//le Abno avranno una lista di base ma poi devono avere la exp memorizzata a parte quindi tanto vale avere una scheda nuova
      depsList:number[]; //ENUM
      bonusDeps:string[];
      bonusColors:[string,boolean][];//da usare per bonusDeps e customDeps, se si aggiungono altri bonusDeps o customDeps basta aggiungerli qui, bool è per testo bianco o nero
      capPassive:string[];
      controlAbs:string[];
      infoAbs:string[];
      safetyAbs:string[];
      trainAbs:string[];
      discAbs:string[];
      centralAbs:string[];
      welfareAbs:string[];//serve almeno Welfare come reskin di Safety in futuro
      recordsAbs:string[];
      extractAbs:string[];
      architAbs:string[];
      bonus1Abs:string[];
      bonus2Abs:string[];
      bonus3Abs:string[];
      bonus4Abs:string[];
      bonus5Abs:string[];
      bonus6Abs:string[];
      agentAbs:string[]
      traumas:string[]
      traum3nabled:boolean; //per il progetto che dà un'altro slot se completato
}

export class RulesConverter implements FirestoreDataConverter<Rules, rulesFS> {
    toFirestore(user: WithFieldValue<Rules>): WithFieldValue<rulesFS> {
        return {
            gameID: user.gameID,
            gameName: user.gameName,
            DMIds: user.DMIds,
            charaList: user.charaList,
            deadCh: user.deadCh,
            abnoList: user.abnoList,
            depsList: user.depsList,
            bonusDeps: user.bonusDeps,
            bonusColors: user.bonusColors,
            capPassive: user.capPassive,
            controlAbs: user.controlAbs,
            infoAbs: user.infoAbs,
            safetyAbs: user.safetyAbs,
            trainAbs: user.trainAbs,
            discAbs: user.discAbs,
            centralAbs: user.centralAbs,
            welfareAbs: user.welfareAbs,
            recordsAbs: user.recordsAbs,
            extractAbs: user.extractAbs,
            architAbs: user.architAbs,
            bonus1Abs: user.bonus1Abs,
            bonus2Abs: user.bonus2Abs,
            bonus3Abs: user.bonus3Abs,
            bonus4Abs: user.bonus4Abs,
            bonus5Abs: user.bonus5Abs,
            bonus6Abs: user.bonus6Abs,
            agentAbs: user.agentAbs,
            traumas: user.traumas,
            traum3nabled: user.traum3nabled
        };
    }
    
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Rules {
        const data = snapshot.data(options) as rulesFS;
        return new Rules(data.gameID, data.gameName, data.DMIds, data.charaList, data.deadCh, data.abnoList, data.depsList, data.bonusDeps, data.bonusColors, data.capPassive, data.controlAbs, data.infoAbs, data.safetyAbs, data.trainAbs, data.discAbs, data.centralAbs, data.welfareAbs, data.recordsAbs, data.extractAbs, data.architAbs, data.bonus1Abs, data.bonus2Abs, data.bonus3Abs, data.bonus4Abs, data.bonus5Abs, data.bonus6Abs, data.agentAbs, data.traumas, data.traum3nabled);
    }
}