import { fetchActiveTimetableID, fetchUserSchedules, IScheduleContent, fetchTermCodeBySchoolId, fetchScheduleContent, TableTime, IScheduleDetail } from "@/api/timetable";
import { store } from "@/store";
import { ref, Ref, watch, watchEffect } from "vue";

interface TeachClassSchedule extends IScheduleDetail {
    DateOfWeek: number;
    fontShowTime: string;
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
    const teachClassScheduleArr: TeachClassSchedule[] = [];
    let weekScheduleArr: IScheduleContent[] = [];
    let classTimeArr: TableTime[] = [];
    const schedules = ref<Schedule[]>([]);
    const timetableID = ref("");
    const semesterDataID = ref(""); // 学期ID
    const termCode = ref("");

    const getTimetableID = async () => {
        const schoolID = store.state.userInfo.Schools![0]?.UserCenterSchoolID;
        if (!schoolID) {
            return;
        }

        const termCodeRes = await fetchTermCodeBySchoolId({
            id: schoolID
        });

        semesterDataID.value = termCodeRes.result.TermId;
        termCode.value = termCodeRes.result.TermCode;
        if (termCodeRes.resultCode === 200 && termCodeRes.result) {
            const res = await fetchActiveTimetableID({
                schoolID,
                semesterDataID: termCodeRes.result.TermId
            });
            if (res.resultCode === 200 && res.result) {
                timetableID.value = res.result.ID;
            }
        }
    };

    const getTeachClassSchedule = async () => {
        const schoolID = store.state.userInfo.Schools![0]?.UserCenterSchoolID;
        if (!schoolID) return;
        const res = await fetchUserSchedules({
            StartTime: days.value[0],
            EndTime: days.value[6],
            TermCode: termCode.value,
            SchoolID: schoolID,
            TeacherID: store.state.userInfo.userCenterUserID
        });

        if (res.resultCode === 200) {
            classTimeArr = res.result.tableTimeList;
            res.result.TeacherCourseList.forEach(item => {
                item.ScheduleDetailData.forEach(schedule => {
                    const fontShowTime = `${schedule.StartTime.substring(0, 5)}~${schedule.EndTime.substring(0, 5)}`;
                    teachClassScheduleArr.push({ ...schedule, DateOfWeek: item.DateOfWeek, fontShowTime });
                });
            });
        }
    };

    const getWeekSchedule = async () => {
        if (!timetableID.value) return;
        const res = await fetchScheduleContent({
            timetableMainID: timetableID.value,
            beginTime: days.value[0],
            endTime: days.value[days.value.length - 1]
        });
        if (res.resultCode === 200 && res.result) {
            weekScheduleArr = res.result;
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
            weekScheduleArr = [];
            weekScheduleArr.forEach(item => {
                const index = colData.findIndex(data => {
                    return item.ScheduleID === data.ID;
                });
                if (index !== -1) {
                    colData[index] = { ...colData[index], ...item };
                }
            });
            return {
                ...classTime,
                colData: colData,
                fontShowTime
            };
        });
    };

    const initSchedules = async () => {
        await getTimetableID();
        if (!timetableID.value) return;
        await Promise.all([getTeachClassSchedule(), getWeekSchedule()]);
        dealSchedules();
    };

    const updateSchedules = async () => {
        // await getWeekSchedule();
        await Promise.all([getTeachClassSchedule(), getWeekSchedule()]);
        dealSchedules();
    };

    const updateClassSchedule = async () => {
        await getTeachClassSchedule();
        dealSchedules();
    };

    watchEffect(() => {
        const id = store.state.userInfo.Schools![0]?.ID;
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
        getWeekSchedule,
        initSchedules,
        updateClassSchedule,
        updateSchedules,
        schedules
    };
};
