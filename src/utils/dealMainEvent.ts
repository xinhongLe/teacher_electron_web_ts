import isElectron from "is-electron";
import useSubjectPublisherBookList, { subjectPublisherBookList } from "@/hooks/useSubjectPublisherBookList";
import { lookQuestions, lookVideo } from ".";

if (isElectron()) {
    window.electron.ipcRenderer.on("fetchSubjectPublisherBookList", async (event) => {
        await useSubjectPublisherBookList();
        event.sender.send("fetchSubjectPublisherBookList", JSON.parse(JSON.stringify(subjectPublisherBookList.value)));
    });

    window.electron.ipcRenderer.on("lookVideo", (_, data) => {
        lookVideo(data);
        window.electron.showWindow(true);
    });

    window.electron.ipcRenderer.on("lookQuestions", (_, data) => {
        lookQuestions(data);
        window.electron.showWindow(true);
    });
}
