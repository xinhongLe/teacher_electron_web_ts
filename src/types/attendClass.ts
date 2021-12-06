import { CourseBag } from "@/api";
import { Pager, PagerData } from "./pager";

export interface FetchTeacherClassesData {
    firstDayOfWeek: string;
}

export interface TeacherClasses {
    AfterEnable: boolean;
    BeforeEnable: boolean;
    Classes: CourseBag[];
}

export interface FinishClassData {
    id: string;
}

export interface AssignPaperHomeworkData {
    id: string;
}

export interface AssignDefaultHomeworkData {
    id: string;
    type: number;
    name: string;
}

export interface FetchCourseBagTeachingLogsByIDData {
    id: string;
}

export interface FetchTeacherHistoryClassesData {
    pager: PagerData;
    startTime: string;
    endTime: string;
    subjectID: string;
    classID: string;
}

export interface FetchTeacherHistoryClassesRes {
    list: CourseBag[],
    pager: Pager
}
