import { createApp } from "vue";
import App from "./App.vue";
import { store, key } from "@/store";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import Icon from "@/plugins/icon";

import Directive from "@/directive/index";
import DragLine from "@/directive/dragLine";
import Drag from "@/directive/drag";
import "@/permission";
import "@/styles/index.scss";
import "@/types";
import "@/utils/web";

import Wincard from "wincard";
import "wincard/dist/wincard.css";

import mitt from "mitt";

import TrackService from "@/utils/common";
import { cacheFile } from "@/utils/file";

TrackService.useTrackPoint();

const app = createApp(App);
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
app.use(Wincard, process.env.VUE_APP_AI_XUE_SHI_API, "https://wincard.lyx-edu.com/swf2canvas.html", cacheFile)
    .use(ElementPlus, { locale: zhCn })
    .use(Icon)
    .use(store, key)
    .use(Directive)
    .use(Drag)
    .use(DragLine)
    .mount("#app");
app.config.globalProperties.mittBus = mitt();

app.config.errorHandler = (err) => {
    window.electron && window.electron.log.error(err);
};

window.onerror = (event, source, lineno, colno, error) => {
    window.electron && window.electron.log.error(error);
};
