import { AI_XUE_SHI_API } from "@/config";
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr";
import { BrowserWindow } from "electron";

interface LYXSocketInputDTO {
    UserID: string;
    UserName: string;
    ThisImageIndex: number;
    FileList: [];
}

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
    }

    private sleep(timeout: number) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout);
        });
    }

    disconnect() {
        this.isUserDisconnect = true;
        if (this.connection) {
            this.connection.stop();
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
