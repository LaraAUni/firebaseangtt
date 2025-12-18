
enum departments {Control, Information, Training, Safety, Disciplinary};
enum roles {Clerk, Agent, Captain};
enum traumas {Cold, Haunted, Obsessed, Distrustful, Reckless, Soft, Volatile, Vicious}


export interface character{
    userid:number[];
    id:number;
    name: string;
    surname: string;
    role: roles;
    department: departments;
    equip:[string,string]
    abilities: string[];
    stress: number;
    phealth: number[];
    mind: number[];
    exp: number;
    skills: [number,number,number,number,number,number,number,number,number,number];
    virtues: [number,number,number,number];
    gifts:[string,number][];
}
