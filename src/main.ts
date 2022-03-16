import { createApp } from "vue";
import App from "./App.vue";
// import "./registerServiceWorker";
import router from "./router";
import { store, key } from "./store";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";

import "@/utils/flexible";
import "./permission";
import "./styles/index.scss";
import "./types";
import "./utils/web";

import WinCard from "wincard";
import "wincard/dist/wincard.css";

import mitt from "mitt";

import TrackService from "@/utils/common";
import { cacheFile } from "./utils/file";
TrackService.useTrackPoint();

const app = createApp(App);
app.use(WinCard, process.env.VUE_APP_AI_XUE_SHI_API, "https://wincard.lyx-edu.com/swf2canvas.html", cacheFile).use(ElementPlus, { locale: zhCn }).use(store, key).use(router).mount("#app");
app.config.globalProperties.mittBus = mitt();

app.config.errorHandler = (err, vm, info) => {
    window.electron && window.electron.log.error(err);
};

window.onerror = (event, source, lineno, colno, error) => {
    window.electron && window.electron.log.error(error);
};

async function onOpenCvReady() {
    (window as any).cv = await (window as any).cv;
}
window.onload = () => {
    const oHead = document.getElementsByTagName("head")[0]; // 在head标签中创建创建script
    const oScript = document.createElement("script");
    oScript.type = "text/javascript";
    oScript.src = "./lib/opencv.js";
    oScript.onload = onOpenCvReady;
    oHead.appendChild(oScript);
};
