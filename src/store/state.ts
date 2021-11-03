import { IUserInfo } from "@/types/user";

export interface State {
    userInfo: IUserInfo;
}

export const state: State = {
    userInfo: {
        Schools: []
    }
};
