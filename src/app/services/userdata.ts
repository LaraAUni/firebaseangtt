import { FirestoreDataConverter, WithFieldValue, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export class UserData {
    games: number[];
    gamenames:string[];
    language: string;
    characters: string[];
    borrow: string[];
    //light mode?
    constructor(games: number[]= [], gamenames: string[]= [], language: string = 'en', characters: string[]=[], borrow: string[]=[]) {
        this.games=games;
        this.gamenames=gamenames;
        this.language=language;
        this.characters=characters;
        this.borrow=borrow;
    }
}


interface UserFS{
    games: number[];
    gameN: string[];
    lang: string;
    characters: string[];
    borrow: string[];
}

export class UserConverter implements FirestoreDataConverter<UserData, UserFS> {
    toFirestore(user: WithFieldValue<UserData>): WithFieldValue<UserFS> {
        return {
            games: user.games,
            gameN: user.gamenames,
            lang: user.language,
            characters: user.characters,
            borrow: user.borrow
        };
    }
    
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): UserData {
        const data = snapshot.data(options) as UserFS;
        return new UserData(data.games, data.gameN, data.lang, data.characters, data.borrow);
    }
}