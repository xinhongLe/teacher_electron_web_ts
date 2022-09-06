import { IResourceItem } from "@/api/resource";
import { Bread } from "@/components/navBar/interface";
import mitt from "mitt";

type Events = {
    deleteQuestion: {
        courseBagId: string;
        paperId: string;
        questionID: string;
    };
    preparationReLoad: null;
    logout: null;
    windowSaveAsSuc: null;
    smallVideo: null;
    smallQuestion: null;
    closeTab: Bread;
    updatePackageCount: null;
    updateResourceList: string;
    openEditResource: IResourceItem;
    errorBookEmit: any;
};

const emitter = mitt<Events>();

export default emitter;
