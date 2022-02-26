import mitt from "mitt";

type Events = {
    deleteQuestion: {
        courseBagId: string,
        paperId: string,
        questionID: string
    };
    preparationReLoad: null
}

const emitter = mitt<Events>();

export default emitter;
