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

export const getWinCardDBData = async (ID: string) => {
    const winCardDB = getWinCardDB();
    const dbResArr = await winCardDB.db.where({ id: ID }).toArray();
    return dbResArr;
};

export const setWinCardDBData = (ID: string, res: any) => {
    const winCardDB = getWinCardDB();
    winCardDB.db.add({ id: ID, result: JSON.stringify(res) });
};

export const updateWinCardDBData = (ID: string, res: any) => {
    const apiResStr = JSON.stringify(res);
    const winCardDB = getWinCardDB();
    winCardDB.db.update({ id: ID, result: apiResStr }, { result: apiResStr });
};
