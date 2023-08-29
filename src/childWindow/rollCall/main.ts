import {createApp} from "vue";
import App from "./App.vue";
import {ElButton, ElTree, ElAvatar, ElCheckbox, ElCheckboxGroup, ElRadio, ElRadioGroup, ElInputNumber, ElForm, ElFormItem, ElDialog, ElInput } from "element-plus";
import "element-plus/dist/index.css";
import "../../styles/reset.scss";
import "../../styles/var.scss";
import {Close} from "@element-plus/icons-vue";

const components = [ElButton, ElTree, ElAvatar, ElCheckbox, Close, ElCheckboxGroup, ElRadio, ElRadioGroup, ElInputNumber, ElForm, ElFormItem, ElDialog, ElInput ];
const app = createApp(App);
components.forEach(component => {
    app.component(component.name, component);
});
app.mount("#app");
