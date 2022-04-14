import { CourseBag, fetchClassTime, fetchTeachClassSchedule, fetchWeekSchedule, GetClassTimeRes, GetTeachClassScheduleRes } from "@/api";
import { fetchActiveTimetableID, fetchUserSchedules, fetchTimetableClassTime, TimetableClassTime, UserSchedules, IScheduleContent, fetchTermCodeBySchoolId, fetchScheduleContent } from "@/api/timetable";
import { store } from "@/store";
import { find } from "lodash";
import moment from "moment";
import { ref, Ref, watch, watchEffect } from "vue";

interface TeachClassSchedule extends UserSchedules {
    fontShowTime: string
}

export type ColData = {
    colDate: string,
    index: number,
    timetableID: string,
} & Partial<IScheduleContent & TeachClassSchedule>

export interface Schedule extends TimetableClassTime{
    fontShowTime: string,
    colData: ColData[]
}

export default (days: Ref<string[]>) => {
    let teachClassScheduleArr: TeachClassSchedule[] = [];
    let weekScheduleArr: IScheduleContent[] = [];
    let classTimeArr: TimetableClassTime[] = [];
    const schedules = ref<Schedule[]>([]);
    const timetableID = ref("");

    const getTimetableID = async () => {
        const schoolID = store.state.userInfo.Schools![0]?.UserCenterSchoolID;
        if (!schoolID) {
            return;
        }

        const termCodeRes = await fetchTermCodeBySchoolId({
            id: schoolID
        });

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
        if (!timetableID.value) return;
        const res = await fetchUserSchedules({
            timetableID: timetableID.value,
            userID: store.state.userInfo.userCenterUserID
        });
        if (res.resultCode === 200) {
            teachClassScheduleArr = res.result.map(item => {
                const fontShowTime = `${item.BeginTime.substring(0, 5)}~${item.EndTime.substring(0, 5)}`;
                return { ...item, fontShowTime };
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

    const getClassTime = async () => {
        if (!timetableID.value) return;
        const res = await fetchTimetableClassTime({
            timetableID: timetableID.value
        });
        if (res.resultCode === 200) {
            classTimeArr = res.result.filter((item) => item.IsShow);
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
                    colData[item.DayOfWeek] = { ...item, ...colData[item.DayOfWeek] };
                }
            });
            weekScheduleArr.forEach(item => {
                const index = colData.findIndex(data => {
                    if (!data.Schedules) return;
                    return find(data.Schedules, { SchedulesID: item.ScheduleID });
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
        await Promise.all([getTeachClassSchedule(), getWeekSchedule(), getClassTime()]);
        dealSchedules();
    };

    const updateSchedules = async () => {
        await getWeekSchedule();
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
