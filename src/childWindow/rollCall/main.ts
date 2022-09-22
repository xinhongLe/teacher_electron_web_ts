import { createApp } from "vue";
import App from "./App.vue";
import { ElButton, ElTree, ElAvatar, ElCheckbox } from "element-plus";
import "element-plus/dist/index.css";
import "../../styles/reset.scss";
const components = [ElButton, ElTree, ElAvatar, ElCheckbox];
const app = createApp(App);
components.forEach(component => {
    app.component(component.name, component);
});
app.mount("#app");
