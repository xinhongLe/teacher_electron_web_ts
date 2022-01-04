import { createApp } from "vue";
import App from "./App.vue";

import { ElCascader, ElInput, ElButton, ElConfigProvider } from "element-plus";
import "element-plus/dist/index.css";

const components = [ElCascader, ElButton, ElInput, ElConfigProvider];
const app = createApp(App);

components.forEach((component) => {
    app.component(component.name, component);
});

app.mount("#app");
