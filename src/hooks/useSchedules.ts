import { fetchClassArrangement } from "@/api/resource";
import { fetchActiveTimetableID, fetchUserSchedules, IScheduleContent, fetchTermCodeBySchoolId, TableTime, IScheduleDetail } from "@/api/timetable";
import { MutationTypes, store } from "@/store";
import { computed, ref, Ref, watch, watchEffect } from "vue";

interface TeachClassSchedule extends IScheduleDetail {
    DateOfWeek: number;
    fontShowTime: string;
    count: number;
    bagId?: string;
    chapterId?: string;
    bookId?: string;
}

export type ColData = {
    colDate: string,
    index: number,
    timetableID: string,
} & Partial<IScheduleContent & TeachClassSchedule>

export interface Schedule extends TableTime{
    fontShowTime: string,
    colData: ColData[]
}

export default (days: Ref<string[]>) => {
    let teachClassScheduleArr: TeachClassSchedule[] = [];
    let classTimeArr: TableTime[] = [];
    const schedules = ref<Schedule[]>([]);
    const timetableID = ref("");
    const semesterDataID = ref(""); // 学期ID
    const termCode = ref("");
    const schoolID = computed(() => store.state.userInfo.schoolId);

    const getTimetableID = async () => {
        if (!schoolID.value) {
            return;
        }

        const termCodeRes = await fetchTermCodeBySchoolId({
            OrgIds: [schoolID.value]
        });

        if (termCodeRes.result.length === 0) return;

        semesterDataID.value = termCodeRes.result[0].SemesterDataId;
        termCode.value = termCodeRes.result[0].SemesterDataCode;

        store.commit(MutationTypes.SET_TERM, { id: semesterDataID.value, code: termCode.value });


        if (termCodeRes.resultCode === 200 && semesterDataID.value) {
            const res = await fetchActiveTimetableID({
                schoolID: schoolID.value,
                semesterDataID: semesterDataID.value
            });
            if (res.resultCode === 200 && res.result) {
                timetableID.value = res.result.ID;
            }
        }
    };

    const getTeachClassSchedule = async () => {
        const schoolID = store.state.userInfo.schoolId;
        if (!schoolID) return;
        const res = await fetchUserSchedules({
            StartTime: days.value[0],
            EndTime: days.value[6],
            TermCode: termCode.value,
            SchoolID: schoolID,
            TeacherID: store.state.userInfo.userCenterUserID
        });

        if (res.resultCode === 200) {
            teachClassScheduleArr = [];
            classTimeArr = res.result.tableTimeList;

            const classArrangementRes = await fetchClassArrangement({
                startTime: days.value[0],
                endTime: days.value[6],
                schoolId: schoolID
            });
            res.result.TeacherCourseList.forEach(item => {
                item.ScheduleDetailData.forEach(schedule => {
                    const obj = classArrangementRes.result.find(item => item.LessonId === schedule.LessonID);
                    const fontShowTime = `${schedule.StartTime.substring(0, 5)}~${schedule.EndTime.substring(0, 5)}`;
                    teachClassScheduleArr.push({ ...schedule, DateOfWeek: item.DateOfWeek, fontShowTime, count: obj?.BagCount || 0, bagId: obj?.Id, chapterId: obj?.ChapterId, bookId: obj?.BookId });
                });
            });
        }
    };

    const dealSchedules = () => {
        schedules.value = classTimeArr.map(classTime => {
            const colData: ColData[] = days.value.map((day, index) => ({
                colDate: day,
                timetableID: timetableID.value,
                index
            }));
            const fontShowTime = `${classTime.BeginTime.substring(0, 5)}~${classTime.EndTime.substring(0, 5)}`;

            teachClassScheduleArr.forEach(item => {
                if (item.fontShowTime === fontShowTime) {
                    const week = item.DateOfWeek === 0 ? 6 : item.DateOfWeek - 1;
                    colData[week] = { ...item, ...colData[week] };
                }
            });
            return {
                ...classTime,
                colData: colData,
                fontShowTime
            };
        });
    };

    const initSchedules = async (resize?: () => void) => {
        await getTimetableID();
        if (!timetableID.value) return;
        await getTeachClassSchedule();
        dealSchedules();
        resize && resize();
    };

    // watch(schoolID, initSchedules)

    const updateSchedules = async () => {
        await getTeachClassSchedule();
        dealSchedules();
    };

    const updateClassSchedule = async () => {
        await getTeachClassSchedule();
        dealSchedules();
    };

    watchEffect(() => {
        const id = store.state.userInfo.schoolId;
        if (id) {
            initSchedules();
        }
    });

    watch(days, () => {
        console.warn("updateSchedules");
        updateSchedules();
    });

    return {
        teachClassScheduleArr,
        initSchedules,
        updateClassSchedule,
        updateSchedules,
        schedules
    };
};
