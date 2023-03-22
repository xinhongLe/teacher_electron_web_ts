import { fetchClassArrangement } from "@/api/resource";
import { GetCurrentUserSchedulingInfo, IGetCurrentUserNewScheduleOutDto } from "@/api/prepare";
import { fetchActiveTimetableID, fetchUserSchedules, IScheduleContent, fetchTermCodeBySchoolId, TableTime, IScheduleDetail, GetClassTimeDetail, ClassTimeDto, ClassTimeDetailDto } from "@/api/timetable";
import { MutationTypes, store } from "@/store";
import { computed, nextTick, ref, Ref, watch, watchEffect } from "vue";

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

export interface Schedule extends TableTime {
    fontShowTime: string,
    colData: ColData[]
}

export type NewColData = {
    colDate: string,
    index: number,
} & Partial<IGetCurrentUserNewScheduleOutDto>

export interface NewSchedule extends ClassTimeDetailDto {
    fontShowTime: string,
    colData: NewColData[]
}

export default (days: Ref<string[]>) => {
    // let teachClassScheduleArr: TeachClassSchedule[] = [];
    // let classTimeArr: ClassTimeDto = {};
    const teachClassScheduleArr = ref<IGetCurrentUserNewScheduleOutDto[]>();
    const classTimeArr = ref<ClassTimeDto>();
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
            const res = await GetClassTimeDetail({
                schoolID: schoolID.value,
                semesterDataID: semesterDataID.value
            });
            if (res.resultCode === 200 && res.result.ClassTimes?.length) {
                classTimeArr.value = res.result.ClassTimes[0];
                // timetableID.value = res.result.ID;
            }
        }
    };

    const getTeachClassSchedule = async () => {
        const schoolID = store.state.userInfo.schoolId;
        if (!schoolID) return;
        // const res = await fetchUserSchedules({
        //     StartTime: days.value[0],
        //     EndTime: days.value[6],
        //     TermCode: termCode.value,
        //     SchoolID: schoolID,
        //     TeacherID: store.state.userInfo.userCenterUserID
        // });

        // if (res.resultCode === 200) {
        // teachClassScheduleArr = [];
        // classTimeArr = res.result.tableTimeList;

        const classArrangementRes = await GetCurrentUserSchedulingInfo({
            startTime: days.value[0],
            endTime: days.value[6],
            // startTime: '2023-09-04',
            // endTime: '2023-09-10',
            schoolId: schoolID,
            termCode: termCode.value
        });
        teachClassScheduleArr.value = classArrangementRes.result;
        // res.result.TeacherCourseList.forEach(item => {
        //     item.ScheduleDetailData.forEach(schedule => {
        //         const obj = classArrangementRes.result.find(item => item.LessonId === schedule.LessonID);
        //         const fontShowTime = `${schedule.StartTime.substring(0, 5)}~${schedule.EndTime.substring(0, 5)}`;
        //         teachClassScheduleArr.push({ ...schedule, DateOfWeek: item.DateOfWeek, fontShowTime, count: obj?.BagCount || 0, bagId: obj?.Id, chapterId: obj?.ChapterId, bookId: obj?.BookId });
        //     });
        // });
        // }
        teachClassScheduleArr.value?.forEach(item => {
            const fontShowTime = `${item.StartTime?.substring(0, 5)}~${item.EndTime?.substring(0, 5)}`;
            const AmpmSectionIndex = `${item.APMP}~${item.SectionIndex}`;
            item.fontShowTime = fontShowTime
            item.AmpmSectionIndex = AmpmSectionIndex
        })
    };

    const newSchedules = ref<NewSchedule[]>([]);
    const dealSchedules = () => {
        if (classTimeArr.value?.ClassTimeDetailDtos && classTimeArr.value?.ClassTimeDetailDtos.length) {
            newSchedules.value = classTimeArr.value?.ClassTimeDetailDtos.map(classTime => {
                const colData = days.value.map((day, index) => ({
                    colDate: day,
                    index
                }));
                const fontShowTime = `${classTime.BeginTime?.substring(0, 5)}~${classTime.EndTime?.substring(0, 5)}`;
                const AmpmSectionIndex = `${classTime.APMP}~${classTime.SectionIndex}`;
                teachClassScheduleArr.value && teachClassScheduleArr.value.forEach(item => {
                    if (item.AmpmSectionIndex === AmpmSectionIndex) {
                        const week = item.DateOfWeek === 0 ? 6 : item.DateOfWeek! - 1;
                        colData[week] = { ...item, ...colData[week] };
                    }
                });
                return {
                    ...classTime,
                    colData: colData,
                    fontShowTime
                };
            });
        }

        console.log('newSchedules.value--', newSchedules.value);

    };

    const initSchedules = async (resize?: () => void) => {
        await getTimetableID();
        if (!classTimeArr.value?.ClassTimeID) return;
        await getTeachClassSchedule();
        dealSchedules();
        resize && nextTick(resize);
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
    // watch(()=>store.state.userInfo.schoolId,(id)=>{
    //     if (id) {
    //         initSchedules();
    //     }
    // },{deep:true})

    watch(days, () => {
        updateSchedules();
    });

    return {
        teachClassScheduleArr,
        initSchedules,
        updateClassSchedule,
        updateSchedules,
        schedules,
        newSchedules
    };
};
