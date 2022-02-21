import isElectron from "is-electron";
import { fetchSubjectPublisherBookList } from "@/views/preparation/api";

if (isElectron()) {
    window.electron.ipcRenderer.on("fetchSubjectPublisherBookList", async (event) => {
        const data = await fetchSubjectPublisherBookList();
        event.sender.send("fetchSubjectPublisherBookList", data);
    });
}
