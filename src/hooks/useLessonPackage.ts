import { MutationTypes, store } from "@/store";
import { reactive, ref, toRefs } from "vue";

export interface IPackage {
    ID:string;
    Title:string;
    Name: string;
    Status:Number
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
                Status:1
            },
            {
                ID:'2',
                Title:'《古诗二首》',
                Name: '备课包2',
                Status:0
            },
            {
                ID:'3',
                Name: '备课包3',
                Title:'《古诗四首》',
                Status:1
            }
        ],//课包数据源
        currentSelectPackageId:"",//当前选择的课包
    });
    const addLessonPackage = () => {
        console.log(123123123);
        
        state.lessonPackageList.push(
            {
                ID:String(Number(state.lessonPackageList.length) + 1),
                Name: '备课包' + Number(Number(state.lessonPackageList.length) + 1),
                Title:'',
                Status:0
            }
        )
    };
    return {
        ...toRefs(state),
        addLessonPackage
    };
};
