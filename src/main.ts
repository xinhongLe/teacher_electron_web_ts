import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import { store, key } from "./store";

import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";

import "@/utils/flexible";
import "./permission";
import "./styles/index.scss";

createApp(App).use(ElementPlus, { locale: zhCn }).use(store, key).use(router).mount("#app");
