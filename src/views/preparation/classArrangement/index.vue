<template>
	<div class="p-layout">
		<div class="p-layout-lesson">
			<!-- <div class="package-item" :class="{isActive:item.ID == currentSelectPackageId}" v-for="(item, index) in lessonPackageList"
				@mousedown.stop.prevent="startDrag($event, item)" @click.stop.prevent="currentSelectPackageId=item.ID">
			{{ item.Name }}
			</div> -->
			<LessonPackage :isMouseDrag="true" :lessonPackageList="lessonPackageList" />
		</div>
		<div class="class-arrangement-warp">
			<Calendar :days="days" ref="calendarRef" :isShowText="true" :isDrop="true" :isShowDetailBtn="true"
				:isShowDelete="true" @openCourse="openCourse">
				<template v-slot:default="slotProps">
					<header class="header">
						<div class="left">
							<div class="left-content-warp">
								<span class="square"></span>
								<span>历史课程</span>
							</div>
							<div class="left-content-warp">
								<span class="square"></span>
								<span>待上课程</span>
							</div>
							<div class="left-content-warp">
								<span class="square"></span>
								<span>缺课包</span>
							</div>
						</div>
						<div class="date-warp">
							<span @click="weekPre" class="arrow-icon">
								<el-icon><arrow-left-bold /></el-icon>
							</span>
							<span class="date">
								{{ nowTime }} ~ {{ lateTime }}</span>
							<span @click="weekNext" class="arrow-icon">
								<el-icon><arrow-right-bold /></el-icon></span>
						</div>
						<div class="right">
							<div class="right-content-warp" @click="slotProps.initSchedules">
								<img src="@/assets/images/preparation/icon_shuaxin_rest.svg" alt="" />
								<span>刷新</span>
							</div>
						</div>
					</header>
				</template>
			</Calendar>
			<el-dialog class="custom-dialog resource-dialog" width="90%" :model-value="visible" title="预览" @close="close()">
				<div class="resource-content">
					<div class="resource-list">
						<!-- <ResourceItem
                        v-for="(item, index) in resourceList"
                        :key="index"
                        :data="item"
                        :btns="false"
                        @eventEmit="eventEmit"
                    /> -->
						<Resources name="preview" :course="course" :source="source" :type="type" />
					</div>
					<div class="resource-filter">
						<el-radio-group class="custom-radio-two" v-model="type">
							<el-radio-button v-for="item in typeList" :key="item.Id" :label="item.Id">
								{{ item.Name }}
							</el-radio-button>
						</el-radio-group>

						<el-button class="switch-btn" type="default" @click="switchClass()">
							<img src="@/assets/images/preparation/icon_qiehuan.png" alt="">
							{{ isSwitch ? "全部显示" : "仅显示备课包" }}
						</el-button>
					</div>
				</div>
			</el-dialog>
		</div>
	</div>
</template>

<script lang="ts">
import useTime from "@/hooks/useTime";
import { defineComponent, ref, PropType } from "vue";
import Calendar from "@/components/calendar/index.vue";
import { ArrowLeftBold, ArrowRightBold } from "@element-plus/icons-vue";
import { ColData } from "@/hooks/useSchedules";
import Resources from "../layout/resources.vue";
import { fetchResourceType, IResourceItem } from "@/api/resource";
import LessonPackage from "../layout/lessonPackage.vue";
import useLessonPackage, { IPackage } from "@/hooks/useLessonPackage";
export default defineComponent({
	props: {
		lessonPackageList: {
			type: Object as PropType<IPackage[]>,
			default: () => [],
		}
	},
	setup() {
		const { currentSelectPackageId } = useLessonPackage();
		const templatesVisible = ref(false);
		const calendarRef = ref<InstanceType<typeof Calendar>>();
		const { days, initDays, nowTime, lateTime, weekPre, weekNext } =
			useTime();
		initDays();

		const success = () => {
			calendarRef.value && calendarRef.value.updateClassSchedule();
		};

		const visible = ref(false);
		const isSwitch = ref(true);
		const openCourse = (data: ColData) => {
			visible.value = true;
			setTimeout(() => {
				source.value = "me";
				course.value = {
					chapterId: data.chapterId as string,
					lessonId: data.LessonID as string
				}
			}, 200);
		};

		const resourceList = ref<IResourceItem[]>([]);

		const course = ref({
			chapterId: "",
			lessonId: ""
		});

		const source = ref("me");
		const type = ref("");
		const typeList = ref<{ Id: string; Name: string }[]>([]);

		const getResourceType = async () => {
			const res = await fetchResourceType();
			if (res.success) {
				res.result.push({
					Id: "",
					Name: "全部"
				});
				typeList.value = res.result.reverse();
			}
		};

		getResourceType();

		const switchClass = () => {
			isSwitch.value = !isSwitch.value;

			if (!isSwitch.value) {
				source.value = "";
			} else {
				// 获取我的备课包
				source.value = "me";
			}
		}

		const close = () => {
			visible.value = false;
		};

		return {
			currentSelectPackageId,
			days,
			nowTime,
			lateTime,
			weekPre,
			success,
			calendarRef,
			templatesVisible,
			weekNext,
			openCourse,
			visible,
			isSwitch,
			resourceList,
			typeList,
			course,
			source,
			type,
			switchClass,
			close
		};
	},
	components: { Calendar, ArrowRightBold, ArrowLeftBold, Resources, LessonPackage }
});
</script>

<style lang="scss" scoped>
.p-layout {
	display: flex;

	.p-layout-lesson {
		height: calc(100vh - 80px);
		overflow-y: auto;
		margin-top: 10px;
		.package-item {
			height: 180px;
			text-align: center;
			line-height: 180px;
			width: 232px;
			background-color: #fff;
			font-size: 30px;
			cursor: pointer;
			margin-bottom: 20px;

			&.isActive {
				outline: 1px solid #409eff;
			}
		}
	}

	.class-arrangement-warp {
		flex: 1;
		padding: 12px 0 0 12px;
		min-height: 0;
		display: flex;
		flex-direction: column;

		.templates-dialog {
			:deep(.el-overlay-dialog) {
				display: flex;

				.el-dialog {
					display: flex;
					flex-direction: column;

					.el-dialog__body {
						flex: 1;
						overflow: auto;
						display: flex;
						flex-direction: column;
					}
				}
			}
		}

		.calendar {
			border-radius: 0;

			:deep(.content-header) {
				height: 44px;
			}

			:deep(.content) {
				.col {
					height: 94px;
				}
			}
		}

		.header {
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 73px;
			padding: 0 20px;

			.left {
				display: flex;
				font-size: 14px;
				font-weight: 600;
				color: #5f626f;

				.left-content-warp {
					display: flex;
					margin-right: 24px;
					align-items: center;

					&:last-child {
						margin-right: 0;
					}

					&:nth-child(2) {
						.square {
							background: #dce6ff;
							border-color: #98aef6;
						}
					}

					&:nth-child(3) {
						.square {
							background: #f0f2f6;
							border-color: #ccced3;
						}
					}

					.square {
						width: 12px;
						height: 12px;
						border-radius: 2px;
						border: 1px solid #86d4ae;
						margin-right: 6px;
						background: #d7f6e7;
					}
				}
			}

			.date-warp {
				flex: 1;
				display: flex;
				align-items: center;
				justify-content: center;

				.arrow-icon {
					color: var(--app-color-primary);
					cursor: pointer;
				}

				.date {
					font-size: 18px;
					font-weight: 600;
					color: var(--app-color-dark);
					margin: 0 32px;
				}
			}

			.right {
				display: flex;
				font-size: 16px;
				color: var(--app-color-dark);
				font-weight: 400;

				.right-content-warp {
					margin-right: 32px;
					display: flex;
					align-items: center;
					cursor: pointer;

					img {
						margin-right: 6px;
					}

					&:last-child {
						margin-right: 0;
					}
				}
			}
		}

		:deep(.resource-dialog) {
			--el-dialog-margin-top: 5vh;
			height: 90vh;
			display: flex;
			flex-direction: column;
			min-height: 0;

			.el-dialog__body {
				background-color: #f5f6fa;
				flex: 1;
				min-height: 0;
				border-bottom-left-radius: 6px;
				border-bottom-right-radius: 6px;
				padding: var(--el-dialog-padding-primary);
			}
		}
	}
}


.resource-content {
	flex: 1;
	min-height: 0;
	height: 100%;
	background-color: #F5F6FA;
	display: flex;
	flex-direction: column;
	overflow: hidden;
}

.resource-list {
	flex: 1;
	min-height: 0;
	margin: 0 -15px;
	display: flex;
	flex-direction: column;
}

.resource-filter {
	padding: 15px;
	background-color: #fff;
	display: flex;
	align-items: center;
	justify-content: space-between;
}

.custom-radio-two {
	:deep(.el-radio-button__inner) {
		margin-right: 10px;
		border-radius: 4px;
		border: 0;
		background: #F0F4FF;
		min-width: 80px;
		color: #4B71EE;
	}

	:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
		color: #fff;
		box-shadow: none;
		background: #4B71EE;
	}

	:deep(.el-radio-button--small .el-radio-button__inner) {
		font-size: 14px;
	}
}

.switch-btn {
	:deep(span) {
		display: flex;
		align-items: center;
	}

	img {
		display: block;
		margin-right: 3px;
	}
}
</style>
