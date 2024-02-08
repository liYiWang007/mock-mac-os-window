import { onMounted, watchEffect, onBeforeUnmount, ref } from 'vue'
import { hasClass } from '@/assets/js/dom'


// useResize
export default (targetRef, resizeRef, position, width,height) => {
    const resizeCursor = ref('default')
    let resizeDirection = []
    // 鼠标悬停时不同方向的箭头
    const onMousemove = (e) => {
        if (hasClass(targetRef.value, 'is-fullscreen')) return
        const mouseX = e.clientX
        const mouseY = e.clientY
        const targetRect = resizeRef.value.getBoundingClientRect()
        const targetLeft = targetRect.left
        const targetTop = targetRect.top
        const targetWidth = targetRect.width
        const targetHeight = targetRect.height
        // 判断鼠标是否在边界上，如果在边界上则显示对应的箭头 start
        const atLeft = mouseX - targetLeft < 10
        const atRight = -mouseX + targetLeft + targetWidth < 10
        const atTop = mouseY - targetTop < 10
        const atBottom = -mouseY + targetTop + targetHeight < 10
        let arrDirection
        if (atLeft) {
            resizeDirection = ['e']
            arrDirection = ['w']
        } else if (atRight) {
            resizeDirection = ['w']
            arrDirection = ['e']
        } else {
            resizeDirection = []
            arrDirection = []
        }
        if (atBottom) {
            resizeDirection.push('s')
            arrDirection.push('s')
        } else if (atTop) {
            resizeDirection.push('n')
            arrDirection.push('n')
        }
        if (resizeDirection.length) {
            resizeCursor.value = arrDirection.reverse().join('') + '-resize'
        } else {
            resizeCursor.value = 'default'
        }
        // 边界判断 end

        const onMouseup = () => {
            document.removeEventListener('mouseup', onMouseup)
        }

        document.addEventListener('mouseup', onMouseup)
    }
    const onMousedown = (e) => {
        if ( !resizeDirection.length || hasClass(targetRef.value, 'is-fullscreen')) return
        e.stopPropagation()
        e.preventDefault()
        // 按下鼠标时移除移动监控
        resizeRef.value.removeEventListener('mousemove', onMousemove)
        const targetRect = resizeRef.value.getBoundingClientRect()
        const targetLeft = targetRect.left
        const targetTop = targetRect.top
        const targetWidth = targetRect.width
        const targetHeight = targetRect.height
        const clientWidth = document.documentElement.clientWidth
        const clientHeight = document.documentElement.clientHeight
        let _width, _height
        const onMousemove2 = (e2) => {
            const downX = e2.clientX
            const downY = e2.clientY
            document.body.style['cursor'] = resizeCursor.value
            if (resizeDirection.includes('w')) {
                // 确保变化范围都在可视区域内
                _width = Math.min(Math.max((downX - targetLeft), 460), (clientWidth - targetLeft))
                width.value=_width
            } else if (resizeDirection.includes('e')) {
                _width = Math.min(Math.max((-downX + targetLeft + targetWidth), 460), (targetWidth + targetLeft))
                position.value.x = -_width + targetWidth + targetLeft
                width.value=_width
            }
            if (resizeDirection.includes('s')) {
                _height = Math.min(Math.max((downY - targetTop), 400), (clientHeight - targetTop))
                height.value=_height
            } else if (resizeDirection.includes('n')) {
                height = Math.min(Math.max((-downY + targetTop + targetHeight), 400), ((targetHeight + targetTop)))
                position.value.y = -_height + targetHeight + targetTop
                height.value=_height
            }
        }

        const onMouseup2 = () => {
            document.body.style['cursor'] = 'default'
            document.removeEventListener('mousemove', onMousemove2)
            document.removeEventListener('mouseup', onMouseup2)
            resizeRef.value.addEventListener('mousemove', onMousemove)
        }

        document.addEventListener('mousemove', onMousemove2)
        document.addEventListener('mouseup', onMouseup2)
    }
    const onResizeable = () => {
        if (targetRef.value && resizeRef.value) {
            resizeRef.value.addEventListener('mousedown', onMousedown)
            resizeRef.value.addEventListener('mousemove', onMousemove)
        }
    }
    const offResizeable = () => {
        if (targetRef.value && resizeRef.value) {
            resizeRef.value.removeEventListener('mousedown', onMousedown)
            resizeRef.value.removeEventListener('mousemove', onMousemove)
        }
    }
    onMounted(() => {
        watchEffect(() => {
            onResizeable()
        })
    })
    onBeforeUnmount(() => {
        offResizeable()
    })
    return { resizeCursor }
}
