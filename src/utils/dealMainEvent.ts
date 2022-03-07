import isElectron from "is-electron";
import useSubjectPublisherBookList, { subjectPublisherBookList } from "@/hooks/useSubjectPublisherBookList";

if (isElectron()) {
    window.electron.ipcRenderer.on("fetchSubjectPublisherBookList", async (event) => {
        await useSubjectPublisherBookList();
        event.sender.send("fetchSubjectPublisherBookList", JSON.parse(JSON.stringify(subjectPublisherBookList.value)));
    });
}
