import { createApp } from "vue";
import App from "./App.vue";
import { ElButton, ElTree } from "element-plus";
import "element-plus/dist/index.css";
const components = [ElButton, ElTree];
const app = createApp(App);
components.forEach(component => {
    app.component(component.name, component);
});
app.mount("#app");
