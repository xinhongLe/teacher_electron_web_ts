import { MutationTypes, store } from "@/store";
import { reactive, ref, toRefs } from "vue";
import { ElMessage, ElMessageBox } from 'element-plus'

export interface IPackage {
    ID:string;
    Title:string;
    Name: string;
    Status:Number;
    data:any
}
interface State {
    lessonPackageList:IPackage[],
    currentSelectPackageId:string
}
export default () => {
    const state:State = reactive({
        lessonPackageList:[
            {
                ID:'1',
                Title:'《古诗三首》',
                Name: '备课包1', 
                Status:1,
                data:null
            },
            {
                ID:'2',
                Title:'《古诗二首》',
                Name: '备课包2',
                Status:0,
                data:null
            },
            {
                ID:'3',
                Name: '备课包3',
                Title:'《古诗四首》',
                Status:1,
                data:null
            }
        ],//课包数据源
        currentSelectPackageId:"",//当前选择的课包
    });
    const addLessonPackage = async (data:any = null) => {
        state.lessonPackageList.push(
            {
                ID:String(Number(state.lessonPackageList.length) + 1),
                Name: '备课包' + Number(Number(state.lessonPackageList.length) + 1),
                Title:'',
                Status:0,
                data:data
            }
        )
        return state.lessonPackageList[state.lessonPackageList.length - 1];
    };

    const deleteLessonPackage = (id: string) => {
            state.lessonPackageList = state.lessonPackageList.filter((item:any)=>{
                return item.ID !== id
            })
            ElMessage({
                type: 'success',
                message: '删除成功',
            })
    }
    return {
        ...toRefs(state),
        addLessonPackage,
        deleteLessonPackage
    };
};
