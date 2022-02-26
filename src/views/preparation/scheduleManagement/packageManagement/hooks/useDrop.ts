import { CourseWares } from "@/api";
import { store } from "@/store";
import { AddCourseWareTeacherElementFileData, BagPapers, Material, UpdateCourseWareListOfTeacherData } from "@/types/preparation";
import { addCourseWareTeacherElementFile, updateCourseWareListOfTeacher, updateCourseWareTeacherSort } from "@/views/preparation/api";
import { ElMessage } from "element-plus";
import { Ref, ref } from "vue";
import { ClassContent } from "./useClassContentList";

export default (callback: () => Promise<void>, classContentList: Ref<ClassContent[]>) => {
    let toSortI = -1;
    let moveInfo:CourseWares;
    let toSortIndex = -1;
    const btnListRef = ref<HTMLDivElement>();

    function isExit (name: string) {
        const findIndex = classContentList.value[toSortIndex].content.findIndex(({ Name }) => name === Name);
        const isExit = findIndex !== -1;
        if (isExit) {
            clearStyle();
            ElMessage.error("存在相同的练习券，不可拖拽.");
        }
        return isExit;
    }

    function clearStyle() {
        const domList = document.querySelectorAll(".problem");
        for (let i = 0; i < domList.length; i++) {
            domList[i].classList.remove("question-before-show");
            domList[i].classList.remove("question-after-show");
        }
    }

    async function updateSort (list: CourseWares[], index: number) {
        const sortList = list.map(({ ID, CopyType }, i) => ({
            courseWareID: ID,
            sort: i + 1,
            copyType: CopyType || 0,
            process: index + 1,
            type: 1
        }));
        const res = await updateCourseWareTeacherSort(sortList);
        if (res.resultCode === 200) {
            callback();
        }
    }

    const onDrop = async (e: DragEvent, index: number, data?: CourseWares) => {
        clearStyle();
        toSortIndex = index;
        const dragInfo = JSON.parse(e.dataTransfer?.getData("dragInfo") as string);
        if (dragInfo.isElement) { // 拖拽精品素材
            const info: Material = dragInfo.info;
            if (isExit(info.ElementName)) return;
            const courseBagTeacherID = store.state.preparation.selectCourseBag.ID || "";
            const data: AddCourseWareTeacherElementFileData = [{
                courseBagID: null,
                courseBagTeacherID,
                name: info.ElementName,
                fileName: `${info.ElementFile.FileName}.${info.ElementFile.Extention}`,
                process: 2,
                sort: toSortI + 1,
                videoDuration: null
            }];
            const res = await addCourseWareTeacherElementFile(data);
            if (res.resultCode === 200) {
                callback();
            }
            return;
        }
        if (dragInfo.ID) {
            moveInfo = dragInfo as CourseWares;
            if (moveInfo.Process === data?.Process) {
                const list = [...classContentList.value[index].content];
                const sortI = list.findIndex(({ ID }) => moveInfo.ID === ID);
                let addIndex = 0;
                if (toSortI !== -1) {
                    sortI > toSortI
                        ? (addIndex = toSortI + 1)
                        : (addIndex = toSortI);
                }
                if (list.length === 1 || addIndex === sortI) return; // 只有一个时或拖动的序号和增加的序号一致
                list.splice(sortI, 1);
                list.splice(addIndex, 0, { ...moveInfo });
                updateSort(list, index);
            } else {
                btnListRef.value!.style.zIndex = "1";
                btnListRef.value!.style.top = e.clientY - 15 + "px";
                btnListRef.value!.style.left = e.clientX - 15 + "px";
            }
        } else {
            const info: BagPapers = dragInfo.info;
            const teacherBookChapter: string = dragInfo.teacherBookChapter;
            if (isExit(info.Name)) return;
            const data: UpdateCourseWareListOfTeacherData = {
                addedCourseWareTeacher: [{
                    CourseBagTeacherID: store.state.preparation.selectCourseBag.ID!,
                    type: 1,
                    process: index + 1,
                    ...info,
                    CourseWareTeacherQuestions: info.Questions,
                    isSelectedAll: false,
                    lessonID: teacherBookChapter
                }],
                CourseBagTeacherID: store.state.preparation.selectCourseBag.ID!
            };
            const res = await updateCourseWareListOfTeacher(data);
            if (res.resultCode === 200) {
                callback();
            }
        }
    };

    const onDragOver = (e: DragEvent, index: number, i: number) => {
        if (store.state.preparation.isDraggingElement && i !== 1) {
            return;
        }
        e.preventDefault();
        clearStyle();
        const target = e.target as HTMLElement;
        if (e.offsetY >= target.offsetHeight / 2) {
            target.classList.add("question-after-show");
            index === 0 ? (toSortI = index + 1) : (toSortI = index);
        } else {
            if (index === 0) {
                toSortI = -1;
                target.classList.add("question-before-show");
            } else {
                toSortI = index - 1;
                target.previousSibling && (target.previousSibling as HTMLElement).classList.add(
                    "question-after-show"
                );
            }
        }
    };

    const onDragleave = () => {
        clearStyle();
    };

    const exit = () => {
        btnListRef.value!.style.zIndex = "-1";
        clearStyle();
    };

    const copy = () => {
        exit();
        if (isExit(moveInfo.Name)) return;
        const list = [...classContentList.value[toSortIndex].content];
        toSortI === -1
            ? list.unshift({ ...moveInfo, CopyType: 2 })
            : list.splice(toSortI, 0, { ...moveInfo, CopyType: 2 });
        updateSort(list, toSortIndex);
    };

    const move = async () => {
        exit();
        if (isExit(moveInfo.Name)) return;
        const data = {
            deletedCourseWareTeacherIDs: [moveInfo.ID]
        };
        const res = await updateCourseWareListOfTeacher(data);
        if (res.resultCode === 200) {
            copy();
        }
    };

    return {
        onDragOver,
        onDrop,
        btnListRef,
        exit,
        copy,
        move,
        onDragleave,
        clearStyle
    };
};
