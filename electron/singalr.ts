import { AI_XUE_SHI_API } from "@/config";
import { LYXSocketInputDTO } from "@/types";
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { BrowserWindow } from "electron";
import ElectronLog from "electron-log";

export default class SingalRHelper {
    private connection: HubConnection | null = null;
    private isUserDisconnect = false;

    constructor(userId: string, window: BrowserWindow) {
        this.connection = new HubConnectionBuilder()
            .withUrl(`${AI_XUE_SHI_API}/lyxHub`, {
                headers: {
                    UserID: userId
                }
            })
            .build();

        this.connection.onclose(() => {
            if (!this.isUserDisconnect) {
                this.start();
            }
        });

        this.connection.on("Projection", (data: LYXSocketInputDTO) => {
            window.webContents.send("singalRData-Projection", data);
        });

        this.connection.on("Answerjection", (data) => {
            window.webContents.send("answer-jection", data);
        });
    }

    private sleep(timeout: number) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }

    disconnect() {
        this.isUserDisconnect = true;
        if (this.connection && this.connection.state == HubConnectionState.Connected) {
            this.connection.stop().catch(err => console.error(err));
        }
    }

    async start() {
        let isConnected = false;
        while (!isConnected && !(this.connection && this.connection.state === HubConnectionState.Connected)) {
            try {
                if (this.connection) {
                    await this.connection.start();
                    isConnected = true;
                }
            } catch (e) {
                await this.sleep(3000);
            }
        }
    }
}
