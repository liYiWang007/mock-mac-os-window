import { defineStore } from 'pinia'
import router from '@/router'

const useHomeStore = defineStore('homeStore', {
  state: () => ({
    activePath: {},
    taskbarList: [{
      id: 1,
      name: 'taskOne',
      icon: './src/assets/images/logo.svg',
      path: '/taskOne'
    }, {
      id: 2,
      name: 'taskTwo',
      icon: './src/assets/images/logo-pink.svg',
      path: '/taskTwo'
    }, {
      id: 3,
      name: 'taskThree',
      icon: './src/assets/images/logo-blue.svg',
      path: '/taskThree'
    }
    ]
  }),
  actions: {
    setActivePath(item) {
      this.activePath = item
      router.push(item.path).then()
    }
  }
})
export default useHomeStore
