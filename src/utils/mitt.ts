import mitt from "mitt";

type Events = {
    deleteQuestion: {
        courseBagId: string,
        paperId: string,
        questionID: string
    };
}

const emitter = mitt<Events>();

export default emitter;
