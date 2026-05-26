
import { FirestoreDataConverter, WithFieldValue, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";
import { last } from "rxjs";
export class Notifclass {
  last5:[string, string, string, string, string]= ['','','','',''];
  trumpets:number=0;
  constructor(last5: [string, string, string, string, string] = ['', '', '', '', ''], trumpets: number = 0){
    this.last5 = last5;
    this.trumpets = trumpets;
  }
}

export interface NotifS{
  lst5:[string, string, string, string, string];
  trpts:number;
}

export class MessageConverter implements FirestoreDataConverter<Notifclass, NotifS> {
    toFirestore(notif: WithFieldValue<Notifclass>): WithFieldValue<NotifS> {
        return {
          lst5: notif.last5,
          trpts: notif.trumpets
        };
    }
    
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Notifclass {
        const data = snapshot.data(options) as NotifS;
        return new Notifclass(data.lst5, data.trpts);
    }

}