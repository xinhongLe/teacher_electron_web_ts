import { createApp } from "vue";
import App from "./App.vue";
import { ElButton, ElInputNumber, ElInput, ElCheckbox, ElCheckboxGroup, ElRadioGroup, ElRadio, ElPopover, ElDialog } from "element-plus";
import { Setting } from "@element-plus/icons-vue";
import "element-plus/dist/index.css";
import "./element.scss";
// import "@/types";
const components = [ElButton, ElInputNumber, ElInput, ElCheckbox, ElCheckboxGroup, ElRadioGroup, ElRadio, ElPopover, ElDialog, Setting];
const app = createApp(App);
components.forEach(component => {
    app.component(component.name, component);
});
app.mount("#app");
