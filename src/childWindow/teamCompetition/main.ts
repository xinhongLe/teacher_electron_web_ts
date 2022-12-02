import { createApp } from "vue";
import App from "./App.vue";
import { ElButton, ElInputNumber, ElPopover } from "element-plus";
import "element-plus/dist/index.css";
import "./element.scss";
const components = [ElButton, ElInputNumber, ElPopover];
const app = createApp(App);
components.forEach(component => {
    app.component(component.name, component);
});
app.mount("#app");
