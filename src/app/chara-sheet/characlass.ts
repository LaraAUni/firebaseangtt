import { FirestoreDataConverter, WithFieldValue, QueryDocumentSnapshot, SnapshotOptions} from "firebase/firestore";

export class Character{
    //gameID e CharID: non serve, è nel nome del documento e nella ricerca
    icoUrl: string;
    fullName: string;
    role: [string, number];
    equip:  [{ imgUrl: string, Name: string},{ imgUrl: string, Name: string}];
    abilities: string[];
    stress: number;
    trauma  : string[];
    armor: boolean; //Armatura Speciale
    physHealth : boolean[]; //[0],[1] Tier 1, [2],[3] Tier 2, [4] Tier 3, [5] Tier 4 ecc
    exp : number[]; //[Generale, Fort, Prud, Temp, Just]
    skills : number[];
    gifts: { imgUrl: string, Name: string, Exp: number }[];
    constructor(
        icoUrl = "0000",
        fullName = "Alpha",
        role: [string, number] = ["Clerk", 0],
        equip: [{ imgUrl: string, Name: string},{ imgUrl: string, Name: string}] = [{ imgUrl: "Standard", Name: "Riot Stick" }, { imgUrl: "Standard", Name: "Suit" }], //da mettere link all'armeria quando è finita
        abilities = Array(3).fill(""),
        stress = 0,
        trauma = Array(3).fill(""),
        armor = true,
        physHealth = Array(9).fill(false),
        exp = Array(5).fill(0),
        skills = Array(10).fill(0),
        gifts:{ imgUrl: string, Name: string, Exp: number }[] = [],
    ) {
        this.icoUrl = icoUrl,
        this.fullName = fullName,
        this.role = role,
        this.equip = equip,
        this.abilities = abilities,
        this.stress = stress,
        this.trauma = trauma,
        this.armor =armor,
        this.physHealth = physHealth,
        this.exp = exp,
        this.skills = skills,
        this.gifts = gifts
    }
}


interface CharaFS{
    icoU: string;
    fName: string;
    rl: [string, number];
    eqp: [{ imgUrl: string, Name: string},{ imgUrl: string, Name: string}];
    abs: string[];
    str: number;
    trm: string[];
    arm: boolean;
    psH: boolean[];
    xp: number[];
    sks: number[];
    gfs: { imgUrl: string, Name: string, Exp: number }[];
}

export class CharaConverter implements FirestoreDataConverter<Character, CharaFS> {
    toFirestore(chara: WithFieldValue<Character>): WithFieldValue<CharaFS> {
        return {
            icoU: chara.icoUrl,
            fName: chara.fullName,
            rl: chara.role,
            eqp: chara.equip,
            abs: chara.abilities,
            str: chara.stress,
            trm: chara.trauma,
            arm: chara.armor,
            psH: chara.physHealth,
            xp: chara.exp,
            sks: chara.skills,
            gfs: chara.gifts,
        };
    }
    
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Character {
        const data = snapshot.data(options) as CharaFS;
        return new Character(data.icoU, data.fName, data.rl, data.eqp, data.abs, data.str, data.trm, data.arm, data.psH, data.xp, data.sks, data.gfs);
    }
}