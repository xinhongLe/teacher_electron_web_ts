import { h, render } from "vue";
import exitDialog from "./exitDialog.vue";

export enum ExitType {
    Cancel,
    Exit,
    Save
}

export default () => {
    return new Promise<ExitType>((resolve) => {
        const container = document.createElement("div");
        const removeDialog = () => {
            // document.body.removeChild(container.firstElementChild!);
            render(null, container);
        };
        const onSave = () => {
            removeDialog();
            resolve(ExitType.Save);
        };

        const onCancel = () => {
            removeDialog();
            resolve(ExitType.Cancel);
        };

        const onExit = () => {
            removeDialog();
            resolve(ExitType.Exit);
        };
        const vnode = h(exitDialog, {
            onSave,
            onExit,
            onCancel
        });
        render(vnode, container);
        document.body.appendChild(container.firstElementChild!);
    });
};
