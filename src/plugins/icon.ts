import { App } from "vue";
import {
    Close, ArrowLeft, ArrowRight, RefreshRight, CloseBold, Setting, Plus, Search, MoreFilled,
    CircleCloseFilled, Rank, DocumentCopy, CircleClose, DArrowLeft, DArrowRight, Paperclip,
    Iphone, User, UserFilled, Warning, Download, Edit
} from "@element-plus/icons-vue";

export default {
    install(app: App) {
        app.component("Close", Close);
        app.component("Edit", Edit);
        app.component("ArrowLeft", ArrowLeft);
        app.component("ArrowRight", ArrowRight);
        app.component("DArrowLeft", DArrowLeft);
        app.component("DArrowRight", DArrowRight);
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
        app.component("Paperclip", Paperclip);
        app.component("Iphone", Iphone);
        app.component("User", User);
        app.component("UserFilled", UserFilled);
        app.component("Warning", Warning);
        app.component("Download", Download);
    }
};
