import {IResourceItem} from "@/api/resource";
import {Bread} from "@/components/navBar/interface";
import mitt from "mitt";

type Events = {
    deleteQuestion: {
        courseBagId: string;
        paperId: string;
        questionID: string;
    };
    preparationReLoad: null;
    logout: null;
    smallVideo: null;
    smallQuestion: null;
    updatePackageCount: null;
    updateResourceList: any;
    openEditResource: IResourceItem;
    errorBookEmit: any;
    openErrorBookDetails: any;
    packButton: any;
    clearErrorBookList: any;
    toMyResource: any;
    closeTool: any;
    checkUpdate: any
};

const emitter = mitt<Events>();

export default emitter;
