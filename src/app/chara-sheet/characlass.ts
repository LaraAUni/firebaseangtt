import { from } from "rxjs";
import { FirestoreDataConverter, WithFieldValue, QueryDocumentSnapshot, SnapshotOptions} from "firebase/firestore";

export class Character{
    gameID: number;
    charID: number;
    playerID : { Owner: string[], Borrower: string[] };
    icoUrl: string;
    fullName: string;
    role: [string, string];
    equip:  [{ imgUrl: string, Name: string},{ imgUrl: string, Name: string}];
    abilities: string[];
    stress: number;
    trauma  : string[];
    armor: boolean; //Armatura Speciale
    physHealth : boolean[]; //[0],[1] Tier 1, [2],[3] Tier 2, [4] Tier 3, [5] Tier 4 ecc
    mindHealth : boolean[];
    exp : number[]; //[Generale, Fort, Prud, Temp, Just]
    skills : number[];
    gifts: { imgUrl: string, Name: string, Exp: number }[];
    mapCoord : number[];
    constructor(
        gameID=0,
        charID=0,
        playerID: { Owner: string[], Borrower: string[] } = { Owner: ["AlphaTT"], Borrower: [] },
        icoUrl = "0000",
        fullName = "Alpha",
        role: [string, string] = ["Clerk", ""],
        equip: [{ imgUrl: string, Name: string},{ imgUrl: string, Name: string}] = [{ imgUrl: "StandardW", Name: "Riot Stick" }, { imgUrl: "StandardS", Name: "Suit" }],
        abilities = Array(3).fill(""),
        stress = 0,
        trauma = Array(3).fill(""),
        armor = true,
        physHealth = Array(9).fill(false),
        mindHealth = Array(9).fill(false),
        exp = Array(5).fill(0),
        skills = Array(10).fill(0),
        gifts:{ imgUrl: string, Name: string, Exp: number }[] = [],
        mapCoord = [0, 0]
    ) {
        this.gameID=gameID,
        this.charID=charID;
        this.playerID = playerID;
        this.icoUrl = icoUrl,
        this.fullName = fullName,
        this.role = role,
        this.equip = equip,
        this.abilities = abilities,
        this.stress = stress,
        this.trauma = trauma,
        this.armor =true,
        this.physHealth = physHealth,
        this.mindHealth = mindHealth,
        this.exp = exp,
        this.skills = skills,
        this.gifts = gifts,
        this.mapCoord = mapCoord
    }
}

interface CharaFS{
    game: number;
    char: number;
    plr: { Owner: string[], Borrower: string[] };
    icoU: string;
    fName: string;
    rl: [string, string];
    eqp: [{ imgUrl: string, Name: string},{ imgUrl: string, Name: string}];
    abs: string[];
    str: number;
    trm: string[];
    arm: boolean;
    psH: boolean[];
    mdH: boolean[];
    xp: number[];
    sks: number[];
    gfs: { imgUrl: string, Name: string, Exp: number }[];
    mapC: number[];
}
export class CharaConverter implements FirestoreDataConverter<Character, CharaFS> {
    toFirestore(chara: WithFieldValue<Character>): WithFieldValue<CharaFS> {
        return {
            game: chara.gameID,
            char: chara.charID,
            plr: chara.playerID,
            icoU: chara.icoUrl,
            fName: chara.fullName,
            rl: chara.role,
            eqp: chara.equip,
            abs: chara.abilities,
            str: chara.stress,
            trm: chara.trauma,
            arm: chara.armor,
            psH: chara.physHealth,
            mdH: chara.mindHealth,
            xp: chara.exp,
            sks: chara.skills,
            gfs: chara.gifts,
            mapC: chara.mapCoord,
        };
    }
    
    fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Character {
        const data = snapshot.data(options) as CharaFS;
        return new Character(data.game, data.char, data.plr, data.icoU, data.fName, data.rl, data.eqp, data.abs, data.str, data.trm, data.arm, data.psH, data.mdH, data.xp, data.sks, data.gfs, data.mapC);
    }
}