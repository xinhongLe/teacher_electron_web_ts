import { createApp } from "vue";
import App from "./App.vue";

import ElementPlus from "element-plus";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import "element-plus/dist/index.css";
import Icon from "@/plugins/icon";

// import { ElButton } from "element-plus";
//
// import { Setting, VideoPlay, Close } from "@element-plus/icons-vue";

// const components = [ElButton, Setting, VideoPlay, Close];

const app = createApp(App);

// components.forEach((component) => {
//     app.component(component.name, component);
// });

app.use(ElementPlus, { locale: zhCn }).use(Icon).mount("#app");
