// 拖拽 hooks
import { onMounted, watchEffect, onBeforeUnmount, ref } from 'vue'
import { hasClass, addClass, removeClass } from '@/assets/js/dom'

// useDrager
export default (targetRef, dragRef) => {
    const position = ref({
        x: 0,
        y: 0
    })
    const cursor = ref('grab')
    const onMouseDown = (e) => {
        // 全屏时禁止拖动
        targetRef.value.focus()
        cursor.value = 'grabbing'
        dragRef.value.style['user-select'] = 'none'
        e.stopPropagation()
        e.preventDefault()

        const downX = e.clientX
        const downY = e.clientY
        const { x, y } = position.value

        const targetRect = targetRef.value.getBoundingClientRect()
        const targetLeft = targetRect.left
        const targetTop = targetRect.top
        let targetWidth = targetRect.width
        let targetHeight = targetRect.height
        const clientWidth = document.documentElement.clientWidth
        const clientHeight = document.documentElement.clientHeight

        const minLeft = -targetLeft + x
        const minTop = -targetTop + y
        let maxLeft = clientWidth - targetLeft - targetWidth + x
        let maxTop = clientHeight - targetTop - targetHeight + y
        const onMousemove = (e2) => {
            // 取消半屏状态后，需要重新计算一下宽高
            if (hasClass(targetRef.value, 'is-half-screen')) {
                removeClass(targetRef.value, 'is-half-screen')
                targetWidth = targetRef.value.getBoundingClientRect().width
                targetHeight = targetRef.value.getBoundingClientRect().height
                maxLeft = clientWidth - targetLeft - targetWidth + x
                maxTop = clientHeight - targetTop - targetHeight + y
            }
            const moveX = Math.min(Math.max(x + e2.clientX - downX, minLeft), maxLeft)
            const moveY = Math.min(Math.max(y + e2.clientY - downY, minTop), maxTop)
            if (clientWidth >= 1080 && clientHeight >= 450) {
                if ((moveX === 0 || moveX === clientWidth - targetWidth) && moveY === 0) {
                    if ( !hasClass(targetRef.value, 'is-moving')) {
                        addClass(targetRef.value, 'is-moving')
                    }
                } else {
                    if (hasClass(targetRef.value, 'is-moving')) {
                        removeClass(targetRef.value, 'is-moving')
                    }
                }
            }
            position.value = {
                x: moveX,
                y: moveY
            }
        }

        const onMouseup = () => {
            document.removeEventListener('mousemove', onMousemove)
            cursor.value = 'grab'
            dragRef.value.style['user-select'] = 'default'
            // 判断是否两边，靠两边的话，设置为半屏
            if (hasClass(targetRef.value, 'is-moving')) {
                removeClass(targetRef.value, 'is-moving')
                if (clientWidth >= 1080 && clientHeight >= 450) {
                    addClass(targetRef.value, 'is-half-screen')
                }
                position.value.y = 0
                if (position.value.x > 0) {
                    position.value.x = clientWidth - targetRef.value.getBoundingClientRect().width
                }
            }
            document.removeEventListener('mouseup', onMouseup)
        }
        document.addEventListener('mousemove', onMousemove)
        document.addEventListener('mouseup', onMouseup)
    }


    const onDraggable = () => {
        if (dragRef.value && targetRef.value) {
            dragRef.value.addEventListener('mousedown', onMouseDown)
        }
    }

    const offDraggable = () => {
        if (dragRef.value && targetRef.value) {
            dragRef.value.removeEventListener('mousedown', onMouseDown)
        }
    }
    onMounted(() => {
        watchEffect(() => {
            onDraggable()
        })
    })
    onBeforeUnmount(() => {
        offDraggable()
    })
    return {
        position,
        cursor
    }
}
