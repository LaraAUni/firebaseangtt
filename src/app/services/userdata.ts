import { FirestoreDataConverter, WithFieldValue, QueryDocumentSnapshot, SnapshotOptions } from "firebase/firestore";

export class UserData {
    name:string;
    games: {date:number, name: string}[];
    language: string;
    characters: string[];
    borrow: string[];
    code: string = '';
    //light mode?
    constructor(name: string='NewUser', games: {date:number, name: string}[]= [], language: string = 'en', characters: string[]=[], borrow: string[]=[], code: string = '') {
        this.name=name;
        this.games=games;
        this.language=language;
        this.characters=characters;
        this.borrow=borrow;
        this.code=code;
    }
}


interface UserFS{
    name:string;
    games: {date:number, name: string}[];
    lang: string;
    characters: string[];
    borrow: string[];
    code: string;
}

export class UserConverter implements FirestoreDataConverter<UserData, UserFS> {
    toFirestore(user: WithFieldValue<UserData>): WithFieldValue<UserFS> {
        return {
            name: user.name,
            games: user.games,
            lang: user.language,
            characters: user.characters,
            borrow: user.borrow,
            code: user.code
        };
    }
    
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): UserData {
        const data = snapshot.data(options) as UserFS;
        return new UserData(data.name, data.games, data.lang, data.characters, data.borrow, data.code);
    }
}