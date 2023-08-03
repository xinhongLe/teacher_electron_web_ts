import { createApp } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";

import "@/styles/index.scss";
import "@/types";
import "@/utils/web";

const app = createApp(App);
// @ts-ignore
app.use(ElementPlus, { locale: zhCn })
    .mount("#app");

app.config.errorHandler = (err, vm, info) => {
    window.electron && window.electron.log.error(err);
};

window.onerror = (event, source, lineno, colno, error) => {
    window.electron && window.electron.log.error(error);
};
