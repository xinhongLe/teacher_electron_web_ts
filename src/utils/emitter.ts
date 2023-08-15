import { IDownloading } from "@/types/store";
import mitt, { Emitter } from "mitt";

export const enum EmitterEvents {
    RICH_TEXT_COMMAND = "RICH_TEXT_COMMAND",
    OPEN_CHART_DATA_EDITOR = "OPEN_CHART_DATA_EDITOR",
    OPEN_LATEX_EDITOR = "OPEN_LATEX_EDITOR",
    SET_UPLOAD_LOADING = "SET_UPLOAD_LOADING",
    WATCH_TABLE_EDITABLE = "WATCH_TABLE_EDITABLE",
    DOWNLOAD_CHANGE = "DOWNLOAD_CHANGE"
}

export interface RichTextCommand {
    command: string;
    value?: string;
}

type Events = {
    [EmitterEvents.RICH_TEXT_COMMAND]: RichTextCommand | RichTextCommand[];
    [EmitterEvents.OPEN_CHART_DATA_EDITOR]: void;
    [EmitterEvents.OPEN_LATEX_EDITOR]: void;
    [EmitterEvents.SET_UPLOAD_LOADING]: boolean;
    [EmitterEvents.WATCH_TABLE_EDITABLE]: boolean;
    [EmitterEvents.DOWNLOAD_CHANGE]: IDownloading[];
};

const emitter: Emitter<Events> = mitt<Events>();

export default emitter;
