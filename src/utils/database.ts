import Dexie from "dexie";

export interface WinCardData {
    id: string;
    result: string;
}
class WinCardDatabase extends Dexie {
    public db: Dexie.Table<WinCardData, number>;

    public constructor() {
        super("WinCardDatabase");
        this.version(1).stores({
            windCard: "id,result"
        });
        this.db = this.table("windCard");
    }
}

let windCardDB = new WinCardDatabase();

export const getWinCardDB = () => {
    return windCardDB;
};

export const destoryWinCardDB = () => {
    windCardDB.delete();
    windCardDB = new WinCardDatabase();
};
