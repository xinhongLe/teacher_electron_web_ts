import { CourseBag, fetchClassTime, fetchTeachClassSchedule, fetchWeekSchedule, GetClassTimeRes, GetTeachClassScheduleRes } from "@/api";
import { store } from "@/store";
import { get, STORAGE_TYPES } from "@/utils/storage";
import moment from "moment";
import { ref, Ref, watch } from "vue";

enum CourseBgColor {
    "语文" = "#4FCC94",
    "数学" = "#63D1FA",
    "英语" = "#9A69EB",
    "拼音" = "#FFD152",
}

interface TeachClassSchedule extends GetTeachClassScheduleRes {
    fontShowTime: string
}

interface WeekSchedule extends CourseBag {
    fontShowDate: string,
    fontShowTime: string
}

type ColData = {
    colDate: string,
    bgColor?: CourseBgColor,
} & Partial<WeekSchedule & TeachClassSchedule>

interface Schedule extends GetClassTimeRes{
    fontShowTime: string,
    colData: ColData[]
}

export default (days: Ref<string[]>) => {
    let teachClassScheduleArr: TeachClassSchedule[] = [];
    let weekScheduleArr: WeekSchedule[] = [];
    let classTimeArr: GetClassTimeRes[] = [];
    const schedules = ref<Schedule[]>([]);
    const getTeachClassSchedule = async () => {
        const res = await fetchTeachClassSchedule({
            classID: "",
            subjectID: ""
        });
        if (res.resultCode === 200) {
            teachClassScheduleArr = res.result.map(item => {
                const fontShowTime = moment(item.BeginTime).format("HH:mm") +
                "~" +
                moment(item.EndTime).format("HH:mm");
                return { ...item, fontShowTime };
            });
        }
    };

    const getWeekSchedule = async () => {
        const data = {
            firstDayOfWeek: days.value[0]
        };
        const res = await fetchWeekSchedule(data);
        if (res.resultCode === 200) {
            weekScheduleArr = res.result.Classes.map(item => {
                const fontShowDate = moment(
                    item.ClassPlanStartTime
                ).format("YYYY-MM-DD");
                const fontShowTime =
                moment(item.ClassPlanStartTime).format("HH:mm") +
                "~" +
                moment(item.ClassPlanEndTime).format("HH:mm");
                return { ...item, fontShowDate, fontShowTime };
            });
        }
    };

    const getClassTime = async () => {
        const schoolId = store.state.userInfo.Schools![0]?.ID;
        if (!schoolId) {
            return;
        }
        const data = {
            schoolID: get(STORAGE_TYPES.USER_INFO).Schools[0].ID
        };
        const res = await fetchClassTime(data);
        if (res.resultCode === 200) {
            classTimeArr = res.result;
        }
    };

    const dealSchedules = () => {
        schedules.value = classTimeArr.map(classTime => {
            const colData: ColData[] = days.value.map((day) => ({
                colDate: day
            }));
            const fontShowTime =
                moment(classTime.StartTime).format("HH:mm") +
                "~" +
                moment(classTime.EndTime).format("HH:mm");
            teachClassScheduleArr.forEach(item => {
                if (item.fontShowTime === fontShowTime) {
                    const SubjectName = item.SubjectName as keyof typeof CourseBgColor;
                    const bgColor = CourseBgColor[SubjectName] || "";
                    colData[item.DayOfWeek] = { ...item, ...colData[item.DayOfWeek], bgColor };
                }
            });
            weekScheduleArr.forEach(item => {
                const index = colData.findIndex(data => item.fontShowDate === data.colDate && item.fontShowTime === fontShowTime);
                if (index !== -1) {
                    const SubjectName = item.SubjectName as keyof typeof CourseBgColor;
                    const bgColor = CourseBgColor[SubjectName] || "";
                    colData[index] = { ...colData[index], ...item, bgColor };
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
        await Promise.all([getTeachClassSchedule(), getWeekSchedule(), getClassTime()]);
        dealSchedules();
    };

    const updateSchedules = async () => {
        await getWeekSchedule();
        dealSchedules();
    };

    watch(() => store.state.userInfo.Schools![0]?.ID, initSchedules);

    return {
        teachClassScheduleArr,
        getWeekSchedule,
        initSchedules,
        updateSchedules,
        schedules
    };
};
