import { createApp } from "vue";
import App from "./App.vue";

import "../../styles/index.scss";
import "element-plus/dist/index.css";

import {
    ElAvatar,
    ElIcon,
    ElButton,
    ElSelect,
    ElOption,
    ElCheckbox,
    ElProgress,
    ElConfigProvider
} from "element-plus";

import { Close } from "@element-plus/icons-vue";

const components = [
    ElAvatar,
    ElIcon,
    ElButton,
    ElSelect,
    ElOption,
    ElCheckbox,
    ElProgress,
    Close,
    ElConfigProvider
];

const app = createApp(App);

components.forEach((component) => {
    app.component(component.name, component);
});

app.mount("#app");
