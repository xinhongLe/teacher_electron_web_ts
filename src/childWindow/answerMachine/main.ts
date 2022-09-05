import { createApp } from "vue";
import App from "./App.vue";

import "../../styles/index.scss";
import "element-plus/dist/index.css";

import {
    ElForm,
    ElFormItem,
    ElTooltip,
    ElAvatar,
    ElIcon,
    ElButton,
    ElSelect,
    ElOption,
    ElCascader,
    ElProgress,
    ElConfigProvider
} from "element-plus";

import {
    Sort,
    Close,
    Clock,
    AlarmClock,
    Warning,
    CircleCheck
} from "@element-plus/icons-vue";

const components = [
    ElForm,
    ElFormItem,
    ElTooltip,
    ElAvatar,
    ElIcon,
    ElButton,
    ElSelect,
    ElOption,
    ElCascader,
    Sort,
    ElProgress,
    Close,
    Clock,
    AlarmClock,
    Warning,
    CircleCheck,
    ElConfigProvider
];

const app = createApp(App);

components.forEach((component) => {
    app.component(component.name, component);
});

app.mount("#app");
