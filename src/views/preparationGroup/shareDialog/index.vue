<template>
    <div class="shareDetailContent">
        <el-dialog :title="title" center v-model="isShowDialog" :close-on-click-modal="false">
            <div v-if="!isEdit">
                <el-form ref="uploadForm" :model="ruleForm" :rules="rules" class="lessonPrepOption">
                    <span class="formTitle"><span class="requireIcon">*</span>集体备课主题:</span>
                    <el-form-item prop="courseContent" class="rightContent">
                        <el-input
                            maxlength="20"
                            v-model="ruleForm.courseContent"
                            autosize
                            clearable
                            placeholder="请输入此次集体备课的主题，例如第3单元，长方形与正方形"
                        />
                    </el-form-item>
                </el-form>
            </div>
            <div class="lessonPrepOption">
                <span class="formTitle">邀请备课教师:</span>
                <div class="dialogContent">
                    <div class="leftContent">
                        <el-select popper-class="popper-teacher-box" class="teacher-box" v-model="searchString" size="medium" filterable placeholder="搜索" @focus="fetchShareObjectCustomer" @change="addToTag($event)">
                            <el-option
                                v-for="item in storageTeacherList"
                                :key="item.ID"
                                :label="item.Name"
                                :value="item.ID"
                            >
                                <div>
                                    <div>
                                        <div class="selectInfo">
                                            <img class="avatar" src="../../../assets/preparationGroup/avatar_default.png" />
                                            <div>
                                                <p class="name">{{ item.Name }}</p>
                                                <!-- <p class="group">{{ item.group }}</p> -->
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </el-option>
                            <template #empty>
                                <div class="empty-box">
                                    <img src="../../../assets/preparationGroup/pic_noresult.png">
                                    <p class="emptyContent">搜索无结果</p>
                                </div>
                            </template>
                        </el-select>
                        <div class="tagPanel">
                            <el-tag
                                v-for="(tag, i) in dynamicTags"
                                :key="i"
                                closable
                                :disable-transitions="false"
                                @close="handleClose(tag, i)"
                                class="tagDiv"
                            >
                                {{ tag.Name }}
                            </el-tag>
                        </div>
                        <div class="countNum">{{`已选(${dynamicTags.length}/${maxSize})`}}</div>
                    </div>
                    <div class="rightContent" >
                        <div class="organization" v-if="organizationVisible">
                            <div class="optionTitle">
                                <img class="logo" src="../../../assets/preparationGroup/avatar_default.png" />
                                <span class="organization-span">{{ schoolList[0] && schoolList[0].Name }}</span>
                                <el-select v-if="false" class="organization-select" v-model="selectOption" @change="fetchShareCustomerList($event)" size="medium" filterable>
                                    <el-option
                                        v-for="item in schoolList"
                                        :key="item.ID"
                                        :label="item.Name"
                                        :value="item.ID"
                                    >
                                    <div class="selectInfo">
                                        <img class="avatar" src="../../../assets/preparationGroup/avatar_default.png" />
                                        <p class="group">{{ item.Name }}</p>
                                    </div>
                                    </el-option>
                                    <template #empty>
                                        <div class="empty-box">
                                            <img src="../../../assets/preparationGroup/pic_noresult.png">
                                            <p class="emptyContent">搜索无结果</p>
                                        </div>
                                    </template>
                                </el-select>
                            </div>
                            <div class="optionContent" v-if="teacherList.length > 0">
                                <div class="all-box" @click="clickCustomer">
                                    <img v-if="isSelectAll" src="../../../assets/preparationGroup/checkbox_cycle_selected.png">
                                    <img v-else src="../../../assets/preparationGroup/checkbox_cycle.png">
                                    <span class="select-all">全选</span>
                                </div>
                                <div class="customer-box-parent">
                                    <div v-for="(item,index) in teacherList" :key="index" class="customer-box" @click="clickCustomer(item)">
                                        <div class="Active-box">
                                            <img v-if="item.Active" src="../../../assets/preparationGroup/checkbox_cycle_selected.png">
                                            <img v-else src="../../../assets/preparationGroup/checkbox_cycle.png">
                                        </div>
                                        <img class="avatarImg" src="../../../assets/preparationGroup/avatar_default.png">
                                        <div class="customer-info">
                                            <p class="customerName">{{item.Name}}</p>
                                            <!-- <p class="position">{{item.position}}</p> -->
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-else class="empty-box">
                                <img src="../../../assets/preparationGroup/pic_noresult.png">
                                <p class="emptyContent">搜索无结果</p>
                            </div>
                            <div class="optionContent" v-if="false">
                                <div v-for="(item,index) in organization" :key="index" class="organization">
                                    <img class="orginizationImg" src="../../../assets/preparationGroup/avatar_default.png">
                                    <span class="organizationContent" @click="enterPath(index)">{{item.name}}</span>
                                </div>
                            </div>
                        </div>
                        <div class="organizationGroup" v-if="organizationGroupVisibility">
                            <div @click="returnToOriginPage()" class="organizationGroupHeader">
                                <span class="organizationGroupReturnBtn"><img src="../../../assets/preparationGroup/avatar_default.png"></span>
                                <span class="organizationGroupTitle">{{selectOption}}</span>
                            </div>
                            <div v-for="(item,index) in organizationGourp" :key="index" class="groupContent">
                                <el-radio v-model="selectGroup" label="1">{{ item.name }}</el-radio>
                                <p class="next"><span class="splider"></span><img src="../../../assets/preparationGroup/avatar_default.png"><span>下级</span></p>
                            </div>
                        </div>
                        <div class="optionGroup" v-if="optionMemberVisibility">
                            <div class="optionGroupHeader">
                                <div class="optionReturnBtn" @click="returnToOriginPage()"><img src="../../../assets/preparationGroup/avatar_default.png"></div>
                                <div>
                                    <div class="optionGroupTitle">{{organization[selectOrganizationIndex].name}}</div>
                                    <div>
                                        <span>{{`${selectOption} / ${organization[selectOrganizationIndex].name}`}}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="optionGroupContent" v-for="(item, index) in searchResult" :key="index">
                                <el-checkbox v-model="selectTeacher[index]"></el-checkbox>
                                <div class="teacherInfo">
                                    <img class="avatar" src="../../../assets/preparationGroup/avatar_default.png" />
                                    <div>
                                        <p class="name">{{ item.name }}</p>
                                        <p class="group">{{ item.group }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="lessonPrepOption">
                <span class="formTitle"></span>
                <div class="inviteInfo">*若邀请人员不在列表，可在点击【确认】后，通过备课空间列表里的复制链接进行邀请</div>
            </div>
            <div class="dialogFooter">
                <span class="cancel" @click="closeDialog">取消</span>
                <span class="confirm" @click="confirm">确认</span>
            </div>
        </el-dialog>
    </div>
</template>
<script lang="ts">
import { toRefs, reactive, nextTick, defineComponent, getCurrentInstance, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import userShareList from "./userShareList";
import { GetSchoolClassData } from "@/types/preparationGroup";
import { set, get, STORAGE_TYPES } from "@/utils/storage";
import { addPreLesson, editPreparateTeachers, fetchThisFraineseTeachers } from "../api";
export default defineComponent({
    props: {
        isEdit: {
            type: Boolean,
            default: false
        }
    },
    setup(props, { emit }) {
        const { proxy } = getCurrentInstance() as any;
        const route = useRoute();
        const { teacherList, schoolList, getTeacher, getSchool } = userShareList();
        const uploadForm = ref();
        const state = reactive({
            title: props.isEdit ? "人员管理" : "发起集体备课",
            isShowDialog: false,
            organizationVisible: true,
            organizationGroupVisibility: false,
            optionMemberVisibility: false,
            selectOption: "",
            selectOptionID: "",
            selectOrganizationIndex: "",
            shareOrganization: "",
            selectGroup: "",
            storageTeacherList: [],
            selectTeacher: {},
            dynamicTags: [
                {
                    Active: false,
                    ID: "",
                    Name: ""
                }
            ],
            maxSize: 100,
            searchResult: [
                // {
                //     id: 1,
                //     name: "张天明",
                //     group: "数学组组长"
                // },
                // {
                //     id: 2,
                //     name: "张思聪",
                //     group: "英语教师"
                // },
            ],
            originResult: [
            ],
            searchString: "",
            shareOption: [
                // {
                //     id: 1,
                //     name: "苏州实验小学",
                // },
                // {
                //     id: 2,
                //     name: "苏州实验初中",
                // },
                // {
                //     id: 3,
                //     name: "苏州实验高中",
                // },
                // {
                //     id: 4,
                //     name: "苏州实验大学",
                // },
            ],
            isSelectAll: false,
            customerList: [],
            organization: [
                {
                    id: 1,
                    name: "按组织架构选择"
                },
                {
                    id: 2,
                    name: "按角色选择"
                },
                {
                    id: 3,
                    name: "数学组"
                },
                {
                    id: 4,
                    name: "外部联系人"
                }
            ],
            organizationGourp: [
                {
                    id: 1,
                    name: "全选"
                },
                {
                    id: 2,
                    name: "校长(2人)"
                },
                {
                    id: 3,
                    name: "教务处(4人)"
                },
                {
                    id: 4,
                    name: "数学组(14人)"
                },
                {
                    id: 5,
                    name: "英语组(19人)"
                }
            ],
            ruleForm: {
                courseContent: ""
            },
            rules: {
                courseContent: [
                    { required: true, message: "请输入集体备课主题", trigger: "blur" }
                ]
            }
        });

        const openDialog = () => {
            state.isShowDialog = true;
            nextTick(() => {
                resetShareParams();
                fetchShareObjectOrganization();
                fetchFraineseTeachers();
            });
        };

        const resetShareParams = () => {
            const dynamicTagsSession = sessionStorage.getItem("memberList") ? JSON.parse(sessionStorage.getItem("memberList") || "") : [];
            state.ruleForm.courseContent = "";
            state.searchString = "";
            state.selectOption = "";
            state.selectOptionID = "";
            state.dynamicTags = [];
            if (props.isEdit && dynamicTagsSession && dynamicTagsSession.length > 0) {
                dynamicTagsSession.map((v: any) => {
                    if (v.ID !== get(STORAGE_TYPES.USER_INFO).ID) {
                        state.dynamicTags.push({
                            Active: false,
                            ID: v.ID,
                            Name: v.Name
                        });
                    }
                });
            }
            state.searchResult = [];
            state.shareOption = [];
        };

        const fetchFraineseTeachers = () => {
            teacherList.value = [];
            fetchThisFraineseTeachers({}).then((res: any) => {
                if (res.success) {
                    if (res.result.length > 0) {
                        res.result.map((item: any) => {
                            const resp: any = {
                                ID: item.ID,
                                Name: item.Name,
                                Active: false
                            };
                            if (item.Name && item.Name.length > 0 && item.ID !== get(STORAGE_TYPES.USER_INFO).ID) teacherList.value.push(resp);
                        });
                    }
                }
                state.maxSize = teacherList.value.length;
                set(STORAGE_TYPES.TEACHER_LIST, teacherList.value);
            });
        };

        const fetchShareObjectCustomer = () => {
            state.searchString = "";
            state.searchResult = [];
            state.storageTeacherList = get(STORAGE_TYPES.TEACHER_LIST);
            // fetchFraineseTeachers();
            // getTeacher({ schoolID: state.selectOptionID });
            // const req = {
            //     type: ""
            // };
            // getTeacherList(req: ).then((res: any) => {
            //     if (res.success) {
            //         if (res.result.length > 0) {
            //             res.result.map((item: any) => {
            //                 const obj = {
            //                     id: item.ID,
            //                     name: item.Name,
            //                     organizationID: item.OrganizationID || "",
            //                     group: item.OrganizationName || ""
            //                 };
            //                 state.searchResult.push(obj);
            //             });
            //         }
            //     }
            // });
        };

        const fetchShareObjectOrganization = async () => {
            const userInfo = get(STORAGE_TYPES.USER_INFO);
            state.shareOption = [];
            await getSchool({ id: userInfo.ID }); // "39F832D3E67424EA3F0479BE7957C642"
            setTimeout(() => {
                if (schoolList.value.length > 0) {
                    state.selectOption = schoolList.value[0].Name;
                    state.selectOptionID = schoolList.value[0].ID;
                }
                console.log(state.dynamicTags, teacherList.value);
                if (state.dynamicTags.length > 0) {
                    state.dynamicTags.map((item: any) => {
                        teacherList.value.forEach((itm: any) => {
                            if (item.ID === itm.ID) {
                                itm.Active = true;
                                return false;
                            }
                        });
                    });
                }
            }, 500);
        };

        const fetchShareCustomerList = async (id: string) => {
            state.selectOptionID = id;
            teacherList.value = [];
            state.isSelectAll = false;
            // await getTeacher({ schoolID: id });
            state.dynamicTags.map((item: any) => {
                teacherList.value.forEach((itm: any) => {
                    if (item.ID === itm.ID) {
                        itm.Active = true;
                        return false;
                    }
                });
            });
        };

        const clickCustomer = (item: any) => {
            const ids = state.dynamicTags.map((v: any) => { return v.ID; });
            if (item.ID) {
                item.Active = !item.Active;
                if (item.Active) {
                    if (state.dynamicTags.length === state.maxSize) {
                        ElMessage.info(`最多邀请给${state.maxSize}个人`);
                        item.Active = false;
                        return;
                    }
                    if (ids.indexOf(item.ID) === -1) {
                        state.dynamicTags.push(item);
                    } else {
                        ElMessage.info("该数据已存在");
                    }
                    const left = state.dynamicTags;
                    state.isSelectAll = left.length === teacherList.value.length;
                } else {
                    state.isSelectAll = false;
                    state.dynamicTags.splice(ids.indexOf(item.ID), 1);
                }
            } else {
                if (teacherList.value.length > state.maxSize) {
                    ElMessage.info(`最多邀请给${state.maxSize}个人`);
                    return;
                }
                state.isSelectAll = !state.isSelectAll;
                teacherList.value.map((v: any) => {
                    v.Active = state.isSelectAll;
                });
                if (state.isSelectAll) {
                    teacherList.value.map((v: any) => {
                        if (ids.indexOf(v.ID) === -1) {
                            state.dynamicTags.push(v);
                        }
                    });
                } else {
                    if (state.dynamicTags.length > 0) {
                        state.dynamicTags = [];
                    }
                }
            }
            // 去重
            const array = uniqueArray(state.customerList, "id");
            state.customerList = JSON.parse(JSON.stringify(array));
        };

        const uniqueArray = (array = [], key = "") => {
            const result = [array[0]];
            for (var i = 1; i < array.length; i++) {
                const item = array[i];
                let repeat = false;
                for (var j = 0; j < result.length; j++) {
                    if (item[key] === result[j][key]) {
                        repeat = true;
                        break;
                    }
                }
                if (!repeat) {
                    result.push(item);
                }
            }
            return result;
        };

        const handleClose = (tag: any, index: number) => {
            if (tag.ID === get(STORAGE_TYPES.USER_INFO).ID) {
                ElMessage.info("主备课人无法删除");
                return;
            }
            state.dynamicTags.splice(index, 1);
            if (teacherList.value.length > 0) {
                teacherList.value.map((v: any) => {
                    if (tag.ID === v.ID) {
                        v.Active = false;
                    }
                });
            }
            state.isSelectAll = false;
        };

        const handleSelect = () => {
            state.originResult = state.originResult.length === 0 ? JSON.parse(JSON.stringify(state.searchResult)) : state.originResult;
            // if (state.searchString === "") {
            //     state.searchResult = state.originResult;
            // } else {
            //     const newArray = state.searchResult.filter((item) => {
            //         if (item.name.indexOf(state.searchString) > -1) {
            //             return true;
            //         } else {
            //             return false;
            //         }
            //     });
            //     state.searchResult = JSON.parse(JSON.stringify(newArray));
            // }
        };

        const addToTag = (value: any) => {
            const match = teacherList.value.filter((v: any) => { return v.ID === value; })[0];
            const ids = state.dynamicTags.map((v: any) => { return v.id; });
            if (state.dynamicTags.length === state.maxSize) {
                ElMessage.info(`最多邀请给${state.maxSize}个人`);
                state.searchString = "";
                return;
            }
            if (ids.indexOf(value) === -1) {
                state.dynamicTags.push(match);
                teacherList.value.map((v: any) => {
                    if (match.ID === v.ID) {
                        v.Active = true;
                    }
                });
                // 重置全选
                const left = state.dynamicTags;
                state.isSelectAll = left.length === teacherList.value.length;
            } else {
                ElMessage.info("该数据已存在");
            }
            state.searchString = "";
        };

        const enterPath = (index: any) => {
            state.selectOrganizationIndex = index;
            if (index === 0) {
                state.organizationVisible = false;
                state.organizationGroupVisibility = true;
                state.optionMemberVisibility = false;
            } else if (index === 2) {
                state.organizationVisible = false;
                state.organizationGroupVisibility = false;
                state.optionMemberVisibility = true;
            }
        };

        const returnToOriginPage = () => {
            state.organizationVisible = true;
            state.organizationGroupVisibility = false;
            state.optionMemberVisibility = false;
        };

        const closeDialog = () => {
            state.isShowDialog = false;
        };

        const confirm = async () => {
            if (state.ruleForm.courseContent.trim().length === 0) {
                ElMessage.info("请输入备课主题");
                return;
            }
            const teacherIDs = [get(STORAGE_TYPES.USER_INFO).ID];
            state.dynamicTags.map((item: any) => {
                teacherIDs.push(item.ID);
            });
            if (props.isEdit) {
                const reqEdit = {
                    groupLessonPreparateID: route.params.preId as string,
                    teacherIDs: teacherIDs
                };
                const res = await editPreparateTeachers(reqEdit);
                if (res.resultCode === 200) {
                    ElMessage.success("操作成功");
                    state.isShowDialog = false;
                    emit("submit");
                } else {
                    ElMessage.error("创建失败");
                }
            } else {
                proxy.$refs.uploadForm.validate(async(valid: boolean) => {
                    if (valid) {
                        const req = {
                            preTitle: state.ruleForm.courseContent,
                            status: 0,
                            preLessonContent: "",
                            teacherIDs: teacherIDs
                        };
                        const res = await addPreLesson(req);
                        if (res.resultCode === 200) {
                            ElMessage.success("邀请成功");
                            state.isShowDialog = false;
                            emit("submit");
                        } else {
                            ElMessage.error("创建失败");
                        }
                    }
                });
            }
        };

        return {
            teacherList,
            schoolList,
            getTeacher,
            getSchool,
            openDialog,
            handleClose,
            handleSelect,
            fetchShareCustomerList,
            fetchShareObjectCustomer,
            clickCustomer,
            addToTag,
            enterPath,
            returnToOriginPage,
            closeDialog,
            confirm,
            ...toRefs(state)
        };
    }
});
</script>
<style lang="scss" scoped>
.shareDetailContent {
    display: inline-block;
    .lessonPrepOption {
        display: flex;
        align-items: baseLine;
        margin-bottom: 20px;
        text-align: right;
        .formTitle {
            font-size: 16px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #5F626F;
            margin-right: 12px;
            width: 110px;
            .requireIcon {
                color: #FF4545;
            }
        }
        .rightContent {
            width: calc(100% - 110px);
            text-align: left;
        }
    }
    :deep(.el-dialog) {
        box-shadow: 0px 8px 24px 0px rgba(0, 0, 0, 0.1);
        border-radius: 8px;
        width: 900px;
        max-height: 820px;
        overflow: hidden;
        padding: 0 25px 25px 25px;
        .el-dialog__header {
            font-size: 18px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #0D0B22;
            border-bottom: 1px solid #F3F5F6;
        }
        .el-dialog__body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
            max-height: 100%;
            padding-top: 25px;
        }
        .dialogContent {
            display: flex;
            background: #FFFFFF;
            border-radius: 4px;
            border: 1px solid #E0E2E7;
            padding: 16px;
            width: calc(100% - 110px);
            .leftContent {
                position: relative;
                text-align: left;
                .el-select .el-input__inner {
                    border: 0;
                }
                :deep(el-input__inner) {
                    border: 0;
                }
                width: 50%;
                .tagDiv {
                    background: #F3F3F4;
                    border-radius: 6px;
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #0D0B22;
                    border: none;
                    margin-right: 10px;
                    margin: 0px 10px 10px 0px;
                }
                .el-tag{
                    display: inline-block;
                    .el-tag__close {
                        font-size: 14px;
                        font-family: PingFangSC-Regular, PingFang SC;
                        font-weight: 400;
                        color: #0D0B22;
                        &:hover {
                            background-color: transparent;
                        }
                    }
                }
                .searchInput {
                    border: none;
                    font-size: 14px;
                    font-family: PingFangSC-Regular, PingFang SC;
                    font-weight: 400;
                    color: #9E9EA7;
                }
                .filterDiv {
                    max-height: 372px;
                }
                .countNum {
                    position: absolute;
                    bottom: 0;
                }
            }
            .rightContent {
                width: 50%;
                .el-select .el-input__inner {
                    border: 0;
                }
                .organization {
                    .optionContent {
                        padding: 0 10px;
                        .orginizationImg {
                            display: inline-block;
                            width: 10px;
                            height: auto;
                        }
                        .organization {
                            margin: 24px 0;
                        }
                        .organizationContent {
                            margin-left: 13px;
                            font-size: 14px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #0D0B22;
                            cursor: pointer;
                        }
                        .all-box {
                            display: flex;
                            align-items: center;
                            margin: 20px 0;
                            &:hover {
                                cursor: pointer;
                            }
                            .select-all {
                                font-size: 14px;
                                font-family: PingFangSC-Regular, PingFang SC;
                                font-weight: 400;
                                color: #0D0B22;
                                margin-left: 12px;
                            }
                        }
                    }
                    .customer-box-parent {
                        height: auto;
                        max-height: 350px;
                        overflow-y: auto;
                    }
                    .customer-box {
                        display: flex;
                        align-items: center;
                        margin-bottom: 15px;
                        &:hover {
                            cursor: pointer;
                        }
                        .Active-box {
                            display: flex;
                            align-items: center;
                        }
                        .avatarImg {
                            display: inline-block;
                            width: 36px;
                            height: auto;
                            margin: 0 8px;
                        }
                        .customer-info {
                            .customerName {
                                font-size: 14px;
                                font-family: PingFangSC-Regular, PingFang SC;
                                font-weight: 400;
                                color: #0D0B22;
                            }
                            .position {
                                font-size: 12px;
                                font-family: PingFangSC-Regular, PingFang SC;
                                font-weight: 400;
                                color: #6E6D7A;
                            }

                        }
                    }
                }
                .organizationGroup {
                    .organizationGroupHeader {
                        margin-bottom: 24px;
                        .organizationGroupReturnBtn {
                            color: #9E9EA7 ;
                            margin-right: 20px;
                            cursor: pointer;
                        }
                        .organizationGroupTitle {
                            font-size: 16px;
                            font-family: PingFangSC-Semibold, PingFang SC;
                            font-weight: 600;
                            color: #0D0B22;
                        }
                    }
                    .groupContent {
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .next {
                        display: flex;
                        align-items: center;
                        span {
                            font-size: 14px;
                            font-family: PingFangSC-Regular, PingFang SC;
                            font-weight: 400;
                            color: #9E9EA7;
                            margin-left: 5px;
                        }
                        .splider {
                            display: inline-block;
                            width: 10px;
                            height: 16px;
                            border-left: 1px solid #E7E7E9;
                        }
                    }
                }
                .optionGroup {
                    .optionGroupHeader {
                        display: flex;
                        margin-bottom: 24px;
                        .optionReturnBtn {
                            color: #9E9EA7 ;
                            margin-right: 20px;
                            cursor: pointer;
                        }
                        .optionGroupTitle {
                            font-size: 16px;
                            font-family: PingFangSC-Semibold, PingFang SC;
                            font-weight: 600;
                            color: #0D0B22;
                        }
                    }
                    .optionGroupContent {
                        display: flex;
                        align-items: center;
                        .el-checkbox {
                            margin-right: 9px;
                            .el-checkbox__inner {
                                border-radius: 10px;
                                width: 20px;
                                height: 20px;
                                &:after {
                                    top: 4px;
                                    left: 7px;
                                }
                            }
                        }
                        .teacherInfo {
                            display: flex;
                            align-items: center;
                            .avatar {
                                margin-right: 8px;
                            }
                            .name {
                                font-size: 14px;
                                font-family: PingFangSC-Regular, PingFang SC;
                                font-weight: 400;
                                color: #0D0B22;
                            }
                            .group {
                                font-size: 12px;
                                font-family: PingFangSC-Regular, PingFang SC;
                                font-weight: 400;
                                color: #6E6D7A;
                            }
                        }
                    }
                }
            }
        }
        .inviteInfo {
            font-size: 12px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: #5F626F;
        }
        .dialogFooter {
            text-align: center;
            margin-top: 35px;
            .cancel {
                display: inline-block;
                width: 100px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                background: #FFFFFF;
                border-radius: 6px;
                border: 1px solid #E7E7E9;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #0D0B22;
                margin-left: 20px;
                &:hover {
                    cursor: pointer;
                    border: 1px solid #4B71EE;
                }
            }
            .confirm {
                display: inline-block;
                width: 120px;
                height: 40px;
                line-height: 40px;
                text-align: center;
                background: #4B71EE;
                border-radius: 6px;
                font-size: 14px;
                font-family: PingFangSC-Regular, PingFang SC;
                font-weight: 400;
                color: #FFFFFF;
                margin-left: 20px;
                &:hover {
                    cursor: pointer;
                }
            }
        }
    }
    :deep(.el-dialog__headerbtn) {
        top: 12px !important;
        height: 25px;
    }
    .teacher-box {
        margin-bottom: 20px;
        :deep(.el-input__inner) {
            width: 316px;
        }
        :deep(.el-input__suffix) {
            display: none;
        }
    }
    .tagPanel {
        height: auto;
        max-height: 350px;
        overflow-y: auto;
    }
    .organization-select {
        :deep(.el-input__inner) {
            width: 300px;
            font-size: 16px;
            font-family: PingFangSC-Semibold, PingFang SC;
            font-weight: 600;
            color: #0D0B22;
        }
    }
    .organization-span {
        width: 300px;
        font-size: 16px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #0D0B22;
        padding-left: 10px;
    }
}
.teacher-tip-info {
    font-size: 12px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: #6E6D7A;
    border-bottom: 1px solid #F3F5F6;
    height: 40px;
    margin-top: -6px;
    line-height: 40px;
    padding: 0 20px;
}
.el-select__popper {
    .el-select-dropdown__item{
        height: 60px;
        line-height: 60px;
    }
}

.optionTitle {
    display: flex;
    align-items: center;
}

.logo {
    display: inline-block;
    width: 40px;
    height: auto;
}

.selectInfo {
    display: flex;
    align-items: center;
    height: 60px;
    line-height: 60px;
    border-bottom: 1px solid #F3F5F6;
    .avatar {
        margin-right: 8px;
        display: inline-block;
        width: 36px;
        height: auto;
    }
    .name {
        height: 18px;
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #0D0B22;
        line-height: 18px;
    }
    .group {
        height: 16px;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #6E6D7A;
        line-height: 16px;
    }
}

.popper-teacher-box {
    :deep(.el-select-dropdown__item) {
        padding: 0 !important;
    }
}

.empty-box {
    text-align: center;
    height: 350px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    > img {
        display: inline-block;
        width: 50%;
        height: auto;
        margin: 0 auto;
    }
    .emptyContent {
        margin-top: 15px;
    }
}
</style>
