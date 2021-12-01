import Loading from "./Loading.vue";
import { h, createVNode, render, reactive, toRefs } from "vue";

let loadingInstance: {
    update(options: unknown): void;
    component: unknown;
    destroy(): void;
} | null;

const getLoadingInstance = () => {
    loadingInstance = loadingInstance || newInstance();

    return loadingInstance;
};

const newInstance = () => {
    const data = reactive({
        show: false
    });
    const loadingComponent = {
        name: "Loading",
        setup() {
            return {
                ...toRefs(data)
            };
        },
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        render() {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            return h(Loading, { show: this.show });
        }
    };
    const vm = createVNode(loadingComponent);
    render(vm, document.createElement("div"));
    document.body.appendChild(vm.el as Node);

    return {
        update(options: { show: boolean; }) {
            if ("show" in options) {
                data.show = options.show;
            }
        },
        component: vm.el,
        destroy() {
            if (vm.el) {
                document.body.removeChild(vm.el as Node);
            }
        }
    };
};

const update = (options: unknown) => {
    const instance = getLoadingInstance();

    instance.update(options);
};

const hide = () => {
    setTimeout(() => {
        update({
            show: false
        });
    }, 800);
};

export default {
    show() {
        update({
            show: true
        });
    },

    hide() {
        hide();
    },

    destroy() {
        const instance = getLoadingInstance();
        loadingInstance = null;
        instance.destroy();
    }
};
