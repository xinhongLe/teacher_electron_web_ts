import { MutationTypes, store } from "@/store";
import { reactive, ref, toRefs } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import { AddLessonBag, IAddLessonBag, GetMyLessonBagNew, IGetLessonBagOutDto, IGetPrepareBagCount, PrepareGetMyBagCountNew, DelLessonBag, AddResourceLessonBag, IAddResourceLessonBag, DelResourceLessonBag } from "@/api/prepare";

interface State {
    lessonPackageList: IGetLessonBagOutDto[],
    currentSelectPackageId: string,
    packageCount: number
}
interface ICourse {
    chapterId: string;
    lessonId: string;
    lessonName: string;
    chapterName: string;
}
export default () => {
    const state: State = reactive({
        lessonPackageList: [],//课包数据源
        currentSelectPackageId: "",//当前选择的课包
        packageCount: 0,//我的备课包数量

    });
    const addLessonBag = ref<IAddLessonBag>({
        lessonId: "",
        acaSectionName: "",
        subjectName: "",
        lessonName: "",
        albumId: "",
        subjectId: null,
        sort: 0,
        resourceId: "",
        publisherId: null,
        schoolId: null,
        name: "",
        id: null,
        publisherName: "",
        chapterName: "",
        chapterId: "",
        albumName: "",
        acaSectionId: null
    });

    // 查询登录用户课时下的课包成功
    const getMyLessonBagNew = async (data: { id: string }) => {
        const res = await GetMyLessonBagNew(data);
        if (res.resultCode === 200) {
            state.lessonPackageList = res.result;
            return true
        }
    };
    // 新增备课包
    const addLessonPackage = async (data: IAddLessonBag) => {
        const res = await AddLessonBag(data);
        if (res.resultCode === 200) {
            // ElMessage({
            //     type: 'success',
            //     message: '新增备课包成功',
            // })
            return res.result;
        }
    };

    // 获取备课包数量
    const getPrepareGetMyBagCountNew = async (data: IGetPrepareBagCount) => {
        const res = await PrepareGetMyBagCountNew(data);
        if (res.resultCode === 200) {
            state.packageCount = res.result.BagCount;
        }
    };
    // 删除备课包
    const deleteLessonPackage = async (id: string) => {
        const res = await DelLessonBag({ id });
        if (res.resultCode === 200) {
            ElMessage({
                type: 'success',
                message: '备课包删除成功',
            })
            return true
        }
    };
    // 资源加入备课包
    const addResourceLessonBag = async (data: IAddResourceLessonBag) => {
        const res = await AddResourceLessonBag(data);
        if (res.resultCode === 200) {
            ElMessage({
                type: 'success',
                message: '资源加入备课包成功',
            })
            return res.success
        }
    };
    // 资源移出备课包
    const delResourceLessonBag = async (data: { id: string }) => {
        const res = await DelResourceLessonBag(data);
        if (res.resultCode === 200) {
            ElMessage({
                type: 'success',
                message: '资源移出备课包成功',
            })
            return res.success
        }
    };
    //给addLessonBag 的 章节科目目录赋值
    const setValueAddLessonBag = (course: ICourse) => {
        const book = store.state.preparation.subjectPublisherBookValue;
        addLessonBag.value.subjectName = book?.SubjectName;
        addLessonBag.value.albumId = book?.AlbumId;
        addLessonBag.value.subjectId = book?.SubjectId;
        addLessonBag.value.publisherId = book?.PublisherId;
        addLessonBag.value.publisherName = book?.PublisherName;
        addLessonBag.value.albumName = book?.AlbumName;
        addLessonBag.value.chapterId = course.chapterId;
        addLessonBag.value.chapterName = course.chapterName;
        addLessonBag.value.lessonId = course.lessonId;
        addLessonBag.value.lessonName = course.lessonName;
        addLessonBag.value.schoolId = store.state.userInfo.schoolId;
    }
    return {
        addLessonBag,
        ...toRefs(state),
        addLessonPackage,
        getMyLessonBagNew,
        getPrepareGetMyBagCountNew,
        deleteLessonPackage,
        addResourceLessonBag,
        delResourceLessonBag,
        setValueAddLessonBag
    };
};
