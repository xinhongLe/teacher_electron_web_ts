import {createApp} from "vue";
import App from "./App.vue";

import "element-plus/dist/index.css";
import "../../styles/index.scss";

import {
    ElSwitch,
    ElAvatar,
    ElIcon,
    ElButton,
    ElSelect,
    ElOption,
    ElCheckbox,
    ElProgress,
    ElConfigProvider,
    ElCheckboxGroup, ElRadio, ElRadioGroup
} from "element-plus";

import {Close} from "@element-plus/icons-vue";

const components = [
    ElAvatar,
    ElIcon,
    ElButton,
    ElSelect,
    ElOption,
    ElCheckbox,
    ElProgress,
    ElSwitch,
    Close,
    ElConfigProvider,
    ElCheckboxGroup, ElRadio, ElRadioGroup
];

const app = createApp(App);

components.forEach((component) => {
    app.component(component.name, component);
});

app.mount("#app");
