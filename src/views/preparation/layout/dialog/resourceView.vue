<template>
	<el-dialog
		custom-class="custom-dialog resource-dialog"
		width="90%"
		:model-value="visible"
		@close="close()"
	>
		<template #title>
			<div class="resource-header">
				<ResourceItem
					:hover="false"
					v-if="resource"
					:data="resource"
					:lessonId="lessonId"
                    @eventEmit="eventEmit"
				/>
			</div>
		</template>
		<div class="resource-content" :class="{ 'full-screen': isFullScreen }">
			<div class="full-screen-set" @click="setFullScreen()">
				<img
					src="@/assets/images/preparation/icon_quanping.png"
					alt=""
				/>
			</div>
			<ResourceViewList :type="resource.ResourceShowType" :resource="resource" :target="target" v-if="visible" />
		</div>
	</el-dialog>
</template>

<script lang="ts">
import useWindowInfo, { windowInfoKey } from "@/hooks/useWindowInfo";
import { sleep } from "@/utils/common";
import { enterFullscreen, exitFullscreen } from "@/utils/fullscreen";
import { defineComponent, PropType, provide, ref, watch } from "vue";
import ResourceViewList from "@/views/resourceView/resourceViewList.vue";
import ResourceItem from "../resourceItem.vue";
import { IResourceItem } from "@/api/resource";

export default defineComponent({
	components: { ResourceViewList, ResourceItem },
	props: {
		target: {
			type: String,
			default: ""
		},
		resource: {
			type: Object as PropType<IResourceItem | undefined>,
			required: true
		},
		visible: {
			type: Boolean,
			default: false
		},
		lessonId: {
			type: String,
			default: ""
		}
	},
	setup(props, { emit }) {
		provide(windowInfoKey, useWindowInfo());
		const isFullScreen = ref(false);
		const close = () => {
			emit("update:visible", false);
			if (isFullScreen.value) {
				isFullScreen.value = false;
				setTimeout(() => {
					emit("update:visible", true);
				}, 100);
			} else {
			}
		};

		const setFullScreen = async () => {
			isFullScreen.value = !isFullScreen.value;
			if (isFullScreen.value) {
				if (
					(window as any).electron &&
					!(window as any).electron.isFullScreen() &&
					!(window as any).electron.isMac()
				) {
					(window as any).electron.setFullScreen();
					await sleep(300);
				}
				enterFullscreen();
			} else {
				exitFullscreen();
			}
		};

        const eventEmit = (command: string, data: IResourceItem, event?: MouseEvent | TouchEvent) => {
            emit("eventEmit", command, data, event);
        };

		return {
			isFullScreen,
			close,
			setFullScreen,
            eventEmit
		};
	}
});
</script>

<style lang="scss">
.resource-dialog {
	--el-dialog-margin-top: 5vh;
	height: 90vh;
	display: flex;
	flex-direction: column;
	min-height: 0;
	.el-dialog__body {
		background-color: #f5f6fa;
		flex: 1;
		border-bottom-left-radius: 6px;
		border-bottom-right-radius: 6px;
		padding: var(--el-dialog-padding-primary);
	}
}
</style>

<style lang="scss" scoped>
.resource-header {
	padding-right: 30px;
}

.resource-content {
	height: 100%;
	display: flex;
	flex-direction: column;
	position: relative;
	&.full-screen {
		position: fixed;
		top: 0;
		bottom: 0;
		left: 0;
		right: 0;
		z-index: 1;
	}
	.full-screen-set {
		position: absolute;
		top: 10px;
		right: 10px;
		z-index: 9999;
		cursor: pointer;
	}
}
</style>
