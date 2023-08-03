import { createApp } from "vue";
import App from "./App.vue";
import {
    ElButton,
    ElForm,
    ElFormItem,
    ElIcon,
    ElInput,
    ElOption,
    ElSelect,
} from "element-plus";
import "element-plus/dist/index.css";
import "../../styles/reset.scss";
import "../../styles/var.scss";
import { Close } from "@element-plus/icons-vue";

const components = [
    ElButton,
    ElForm,
    ElFormItem,
    ElInput,
    ElSelect,
    ElOption,
    Close,
    ElIcon
];
const app = createApp(App);
components.forEach((component) => {
    app.component(component.name, component);
});
app.mount("#app");
