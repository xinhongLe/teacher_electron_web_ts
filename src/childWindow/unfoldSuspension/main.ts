import { createApp } from "vue";
import App from "./App.vue";

import { ElCascader, ElInput, ElButton, ElConfigProvider, ElCollapse, ElCollapseItem } from "element-plus";
import "element-plus/dist/index.css";
import "@/styles/var.scss";

const components = [ElCascader, ElButton, ElInput, ElConfigProvider, ElCollapse, ElCollapseItem];
const app = createApp(App);

components.forEach((component) => {
    app.component(component.name, component);
});

app.mount("#app");
