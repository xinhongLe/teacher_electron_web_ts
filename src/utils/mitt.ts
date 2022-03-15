import { Bread } from "@/components/navBar/interface";
import mitt from "mitt";

type Events = {
    deleteQuestion: {
        courseBagId: string,
        paperId: string,
        questionID: string
    };
    preparationReLoad: null,
    logout: null,
    windowSaveAsSuc: null,
    smallVideo: null,
    smallQuestion: null,
    closeTab: Bread
}

const emitter = mitt<Events>();

export default emitter;
