import { createApp } from "vue";
import App from "./App.vue";
import WinCard from "wincard";
import "wincard/dist/wincard.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { cacheFile } from "@/utils/file";
import "@/styles/index.scss";

const app = createApp(App);

app.use(WinCard, process.env.VUE_APP_AI_XUE_SHI_API, "https://wincard.lyx-edu.com/swf2canvas.html", cacheFile)
    .use(ElementPlus, { locale: zhCn })
    .mount("#app");