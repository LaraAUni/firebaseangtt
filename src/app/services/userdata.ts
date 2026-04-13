import { FirestoreDataConverter, WithFieldValue, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export class UserData {
    games: number[];
    gamenames:string[];
    language: string;
    constructor(games: number[]= [], gamenames: string[]= [], language: string = 'en') {
        this.games=games;
        this.gamenames=gamenames;
        this.language=language;
    }
}


interface UserFS{
    games: number[];
    gameN: string[];
    lang: string;
}

export class UserConverter implements FirestoreDataConverter<UserData, UserFS> {
    toFirestore(user: WithFieldValue<UserData>): WithFieldValue<UserFS> {
        return {
            games: user.games,
            gameN: user.gamenames,
            lang: user.language
        };
    }
    
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): UserData {
        const data = snapshot.data(options) as UserFS;
        return new UserData(data.games, data.gameN, data.lang);
    }
}