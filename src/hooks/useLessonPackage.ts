import { MutationTypes, store } from "@/store";
import { reactive, ref, toRefs } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus';
import { AddLessonBag, IAddLessonBag, GetMyLessonBagNew, IGetLessonBagOutDto, IGetPrepareBagCount, PrepareGetMyBagCountNew, DelLessonBag, AddResourceLessonBag, IAddResourceLessonBag, DelResourceLessonBag } from "@/api/prepare";

interface State {
    lessonPackageList: IGetLessonBagOutDto[],
    currentSelectPackageId: string,
    packageCount: number
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
        console.log('查询登录用户课时下的课包成功', res);
        if (res.resultCode === 200) {
            state.lessonPackageList = res.result;
        }
    };
    // 新增备课包
    const addLessonPackage = async (data: IAddLessonBag) => {
        const res = await AddLessonBag(data);
        if (res.resultCode === 200) {
            ElMessage({
                type: 'success',
                message: '新增备课包成功',
            })
            return res.result;
        }
    };

    // 获取备课包数量
    const getPrepareGetMyBagCountNew = async (data: IGetPrepareBagCount) => {
        const res = await PrepareGetMyBagCountNew(data);
        console.log('获取备课包数量成功', res);
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
        console.log('资源加入备课包', res);
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
        console.log('资源移出备课包', res);
        if (res.resultCode === 200) {
            ElMessage({
                type: 'success',
                message: '资源移出备课包成功',
            })
            return res.success
        }
    };
    return {
        addLessonBag,
        ...toRefs(state),
        addLessonPackage,
        getMyLessonBagNew,
        getPrepareGetMyBagCountNew,
        deleteLessonPackage,
        addResourceLessonBag,
        delResourceLessonBag
    };
};
