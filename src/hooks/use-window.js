// 桌面端浮窗 hooks
import { ref } from 'vue'

const useWindow = () => {
// 浮窗的宽高
    const width = ref(1080)
    const height = ref(480)

    return {
        width,
        height
    }
}
export default useWindow
