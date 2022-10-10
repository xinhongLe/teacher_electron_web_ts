import { App } from "vue";
import {
    Close, ArrowLeft, ArrowRight, RefreshRight, CloseBold, Setting, Plus, Search, MoreFilled,
    CircleCloseFilled, Rank, DocumentCopy, CircleClose
} from "@element-plus/icons-vue";

export default {
    install(app: App) {
        app.component("Close", Close);
        app.component("ArrowLeft", ArrowLeft);
        app.component("ArrowRight", ArrowRight);
        app.component("RefreshRight", RefreshRight);
        app.component("CloseBold", CloseBold);
        app.component("Setting", Setting);
        app.component("Plus", Plus);
        app.component("Search", Search);
        app.component("MoreFilled", MoreFilled);
        app.component("CircleCloseFilled", CircleCloseFilled);
        app.component("Rank", Rank);
        app.component("DocumentCopy", DocumentCopy);
        app.component("CircleClose", CircleClose);
    }
};
