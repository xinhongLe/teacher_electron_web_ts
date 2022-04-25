import { CourseBag, fetchClassTime, fetchTeachClassSchedule, fetchWeekSchedule, GetClassTimeRes, GetTeachClassScheduleRes } from "@/api";
import { fetchActiveTimetableID, fetchUserSchedules, fetchTimetableClassTime, TimetableClassTime, UserSchedules, IScheduleContent, fetchTermCodeBySchoolId, fetchScheduleContent, TimetableClassTimeDetailDto } from "@/api/timetable";
import { store } from "@/store";
import { find, uniqBy, uniqWith } from "lodash";
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

export interface Schedule extends TimetableClassTimeDetailDto{
    fontShowTime: string,
    colData: ColData[]
}

export default (days: Ref<string[]>) => {
    let teachClassScheduleArr: TeachClassSchedule[] = [];
    let weekScheduleArr: IScheduleContent[] = [];
    let classTimeArr: TimetableClassTimeDetailDto[] = [];
    const schedules = ref<Schedule[]>([]);
    const timetableID = ref("");
    const semesterDataID = ref(""); // 学期ID

    const getTimetableID = async () => {
        const schoolID = store.state.userInfo.Schools![0]?.UserCenterSchoolID;
        if (!schoolID) {
            return;
        }

        const termCodeRes = await fetchTermCodeBySchoolId({
            id: schoolID
        });

        semesterDataID.value = termCodeRes.result.TermId;
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
        const schoolID = store.state.userInfo.Schools![0]?.UserCenterSchoolID;
        const res = await fetchTimetableClassTime({
            semesterDataID: semesterDataID.value,
            schoolID
        });
        if (res.resultCode === 200) {
            const classTimes = res.result.ClassTimes;
            const list = uniqWith(classTimes[0].ClassTimeDetailDtos, (arrVal, othVal) => {
                return arrVal.APMP + "" + arrVal.SectionIndex === othVal.APMP + "" + othVal.SectionIndex;
            });
            classTimeArr = list.filter((item) => item.IsShow);
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
                    const week = item.DayOfWeek === 0 ? 6 : item.DayOfWeek - 1;
                    colData[week] = { ...item, ...colData[week] };
                }
            });
            weekScheduleArr.forEach(item => {
                const index = colData.findIndex(data => {
                    if (!data.Schedule) return;
                    return item.ScheduleID === data.Schedule.SchedulesID;
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
