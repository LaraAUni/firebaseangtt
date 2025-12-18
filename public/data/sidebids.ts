export interface Sidebids {
    type:string;
    deps:number; //"Controllo","Informazioni","Prevenzione","Formazione","Disciplinare", memorizzati con le informazioni generali perché sono sempre gli stessi ma poi dovrebbero potersi espandere
    ids:number[][];
    names:string[][][];
}
