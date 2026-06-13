import { FirestoreDataConverter, WithFieldValue, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export class UserData {
    games: {id:number, name: string}[];
    language: string;
    characters: string[];
    borrow: string[];
    //light mode?
    constructor(games: {id:number, name: string}[]= [], language: string = 'en', characters: string[]=[], borrow: string[]=[]) {
        this.games=games;
        this.language=language;
        this.characters=characters;
        this.borrow=borrow;
    }
}


interface UserFS{
    games: {id:number, name: string}[];
    lang: string;
    characters: string[];
    borrow: string[];
}

export class UserConverter implements FirestoreDataConverter<UserData, UserFS> {
    toFirestore(user: WithFieldValue<UserData>): WithFieldValue<UserFS> {
        return {
            games: user.games,
            lang: user.language,
            characters: user.characters,
            borrow: user.borrow
        };
    }
    
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): UserData {
        const data = snapshot.data(options) as UserFS;
        return new UserData(data.games, data.lang, data.characters, data.borrow);
    }
}