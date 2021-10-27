import { createApp } from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import { store, key } from "./store";

import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

import "@/utils/flexible";
import "./permission";

createApp(App).use(ElementPlus).use(store, key).use(router).mount("#app");
