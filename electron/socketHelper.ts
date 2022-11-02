import ElectronLog from "electron-log";
import net from "net";

export class Action {
    public METHOD: string;
    public DATA: string;

    constructor(METHOD: string, DATA: string) {
        this.DATA = DATA;
        this.METHOD = METHOD;
    }
}

export interface CallBack {
    OnDataReceive(data: Action): void;
    OnConnected(): void;
    OnDisconnect(): void;
}

export class SocketHelper {
    private callback: CallBack;
    private client = new net.Socket();
    private quene: Array<Buffer> = [];
    private closeSocket = false;

    constructor(processData: CallBack, port = 1122, hostname = "127.0.0.1") {
        this.callback = processData;

        this.init(port, hostname);
    }

    init(port: number, hostname: string) {
        if (this.client.destroyed) {
            this.client = new net.Socket();
        }

        this.client.on('data', data => {
            // console.log(data.toString());
            this.quene.push(data);
        })

        this.client.on('close', hadError => {
            if (hadError) {
                ElectronLog.log('hadError: ', hadError);
            }
            if (!this.closeSocket) {
                this.callback.OnDisconnect();
                this.sleep(3000).then(() => {
                    this.init(port, hostname);
                })
            }
        })

        this.client.on('end', () => {
            this.client.destroy();
        })

        this.client.on('error', err => {
            if (err) {
                ElectronLog.log(err);
            }
            this.client.destroy();
        })

        this.client.connect(port, hostname, () => {
            console.log("connected the server");
            this.callback.OnConnected();
            this.processData();
        })
    }

    async processData() {
        let lastStr = '';
        while (!this.closeSocket) {
            let data = this.quene.shift();
            if (data) {
                lastStr += data.toString();
                while (lastStr.indexOf('\n') !== -1) {
                    let callData = lastStr.substring(0, lastStr.indexOf('\n') + 1).replace(/\s/g, '').replace(/\\n/g, '');
                    let action: Action = JSON.parse(callData);
                    this.callback && this.callback.OnDataReceive(action);
                    lastStr = lastStr.substring(lastStr.indexOf('\n') + 1);
                }
            }
            await this.sleep(2);
        }
    }

    sendMessage(action: Action) {
        return new Promise((resolve, reject) => {
            this.client.writable && this.client.write(JSON.stringify(action) + '\n', err => {
                if (err) {
                    console.error(err);
                    return reject("false");
                    // return reject(err);
                }
                return resolve("ok");
            });
        });
    }

    close() {
        this.closeSocket = true;
        this.client.destroy();
    }

    sleep(timeout: number) {
        return new Promise(resolve => {
            setTimeout(resolve, timeout)
        })
    }
}
