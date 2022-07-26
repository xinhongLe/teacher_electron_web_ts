import { DirectiveBinding } from "vue";

const CTX_CLICK_OUTSIDE_HANDLER = "CTX_CLICK_OUTSIDE_HANDLER";

const clickListener = (
    el: HTMLElement,
    event: MouseEvent,
    binding: DirectiveBinding
) => {
    const handler = binding.value;

    const path = event.composedPath();
    const isClickOutside = path
        ? path.indexOf(el) < 0
        : !el.contains(event.target as HTMLElement);

    if (!isClickOutside) return;
    handler(event);
};

const ClickOutsideDirective = {
    mounted(el: HTMLElement & { [key: string]: (event: MouseEvent) => void }, binding: DirectiveBinding) {
        el[CTX_CLICK_OUTSIDE_HANDLER] = (event: MouseEvent) =>
            clickListener(el, event, binding);
        setTimeout(() => {
            document.addEventListener("click", el[CTX_CLICK_OUTSIDE_HANDLER]);
        }, 0);
    },

    unmounted(el: HTMLElement & { [key: string]: (event: MouseEvent) => void }) {
        if (el[CTX_CLICK_OUTSIDE_HANDLER]) {
            document.removeEventListener(
                "click",
                el[CTX_CLICK_OUTSIDE_HANDLER]
            );
            delete el[CTX_CLICK_OUTSIDE_HANDLER];
        }
    }
};

export default ClickOutsideDirective;