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

import WinCard from "wincard";
import "wincard/dist/wincard.css";

createApp(App).use(WinCard, process.env.VUE_APP_AI_XUE_SHI_API, "https://wincard.lyx-edu.com/swf2canvas.html").use(ElementPlus, { locale: zhCn }).use(store, key).use(router).mount("#app");
