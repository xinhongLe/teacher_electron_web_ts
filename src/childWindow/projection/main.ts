import { createApp } from "vue";
import App from "./App.vue";

import { ElSelect, ElOption, ElButton, ElConfigProvider } from "element-plus";

import "element-plus/dist/index.css";
const components = [ElSelect, ElOption, ElButton, ElConfigProvider];
const app = createApp(App);

components.forEach((component) => {
    app.component(component.name, component);
});

app.mount("#app");
