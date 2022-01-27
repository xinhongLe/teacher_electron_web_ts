import { createApp } from "vue";
import App from "./App.vue";

import "../../styles/index.scss";
import "element-plus/dist/index.css";
import { ElPopover, ElIcon } from "element-plus";
import { Close, Delete, CaretTop, CaretBottom } from "@element-plus/icons-vue";
const components = [ElPopover, ElIcon, Close, Delete, CaretTop, CaretBottom];
const app = createApp(App);
components.forEach((component) => {
    app.component(component.name, component);
});
app.mount("#app");
