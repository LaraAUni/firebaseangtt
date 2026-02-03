export class Characlass {
    gameID = 0;
    charID = 0;
    playerID = { Owner: ["AlphaTT"], Borrower: [] };
    ImgUrl = "0000";
    fullName = { Name: "Alpha", Nickname: "", Surname: "" };
    role = ["Clerk", ""];
    equip = [{ imgUrl: "StandardW", Name: "Riot Stick" }, { imgUrl: "StandardS", Name: "Suit" }];
    abilities = ["", "", ""];
    stress = 0;
    trauma = ["", "", ""];
    physHealth = [false, false, false, false, false, false, false, false, false];
    mindHealth = [false, false, false, false, false, false, false, false, false];
    exp = [0, 0, 0, 0, 0];
    skills = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    gifts: { imgUrl: string, Name: string, Exp: number }[];
    mapCoord = [0, 0];
    constructor() {
        this.gifts = [];
    }
}
