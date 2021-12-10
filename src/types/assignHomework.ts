import { BagPapers, Questions } from "./preparation";

export interface FetchGradeClassStudentsData {
    subjectID: string;
}

export interface Student {
    Account: string;
    ID: string;
    IsSelected: boolean;
    Name: string;
    TagName?: string;
    Phone?: string;
    Sexual: number;
    checked?: boolean;
    classID?: string;
}

export interface ClassData {
    ClassId: string;
    Students: Student[];
    ClassName: string;
}

export interface GradeClassStudent {
    GradeId: string;
    GradeName: string;
    ClassData: ClassData[];
}

export interface CommHomeworkFile {
    extension: string;
    fileName: string;
    name: string;
}

export interface CommHomework {
    type: number;
    students: Student[];
    name: string;
    files: CommHomeworkFile[];
}

export interface SystemHomework extends BagPapers {
    type: number;
    bagPapersName: string;
    bagLessonsName: string;
    version: string;
    students: Student[];
}

export interface Level {
    label: string;
    checked: boolean;
    students: Student[];
}

export interface Paper {
    type: number;
    paperID?: string;
    questionIDs?: Questions[];
    students: {
        studentID: string;
        classID: string;
    }[];
    name?: string;
    files?: {
        fileName: string;
        extension: string;
        name: string;
    }[];
}

export interface PublishHomeworkData {
    classes: { classID: string }[];
    subjectID: string;
    papers: Paper[];
}

export interface Publisher {
    ID: string;
    Name: string;
    Sort: number;
    State: number;
}

export interface FetchWorkbookListData {
    subjectID: string;
    publisherID: string;
    albumID: string;
}

export interface Grade {
    ID: string;
    Name: string;
    Sort: number;
    State: number;
}

export interface FetchWorkbookPaperData {
    workbookID: string;
}

export interface Workbook {
    WorkbookID: string;
    WorkbookName: string;
}

export interface WorkbookPaper {
    UnitName: string;
    PageNumName: string;
    WorkbookPaperID: string;
    WorkbookPaperName: string;
}

export interface TeachHomework extends WorkbookPaper {
    WorkbookName: string;
    publisherName: string;
    gradeName: string;
    students: Student[];
}
