import { DirectiveBinding } from 'vue'

interface MousePos {
  x: number;
  y: number;
}

interface ElementPos {
  x: number;
  y: number;
}

const mouseFollow = {
    mounted(el: HTMLElement, binding: DirectiveBinding) {
        el.style.zIndex = '1000'
        el.style.cursor = 'pointer'
    
        let isFollowingMouse = false
        let mousePos: MousePos = { x: 0, y: 0 }
        let elementPos: ElementPos = { x: 0, y: 0 }
    
        function placeElement() {
        el.style.position = 'absolute'

          if (isFollowingMouse) {
            isFollowingMouse = false
            elementPos.x = mousePos.x - el.offsetLeft
            elementPos.y = mousePos.y - el.offsetTop
          } else {
            isFollowingMouse = true
          }
        }
    
        function onMouseMove(e: MouseEvent) {
          mousePos.x = e.pageX
          mousePos.y = e.pageY
          if (isFollowingMouse) {
            el.style.left = `${mousePos.x - elementPos.x}px`
            el.style.top = `${mousePos.y - elementPos.y}px`
          }
        }
    
        el.addEventListener('click', placeElement)
        document.addEventListener('mousemove', onMouseMove)
    
        binding.value = {
          isFollowingMouse,
          mousePos,
          elementPos
        }
      },
      unmounted(el: HTMLElement) {
        el.removeEventListener('click', () => {})
        document.removeEventListener('mousemove', () => {})
      }
}

const directives = {
    install: function (app: any) {
        app.directive("mouseFollow", mouseFollow);
    },
};
export default directives;
