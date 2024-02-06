import { upperFirst } from 'lodash'

export const classNameToArray = (cls = '') => cls.split(' ').filter((item) => !!item.trim())
export const hasClass = (el, cls) => {
    if ( !el || !cls) return false
    if (cls.includes(' '))
        throw new Error('class不能有空格')
    return el.classList.contains(cls)
}
export const addClass = (el, cls) => {
    if ( !el || !cls.trim()) return
    el.classList.add(...classNameToArray(cls))
}
export const removeClass = (el, cls) => {
    if ( !el || !cls.trim()) return
    if (classNameToArray(cls)) el.classList.remove(...classNameToArray(cls))
}

// 用于获取permissionPath中最后一个/斜杠后面的路径的转化为大驼峰
export const getCamelCaseName = (path) => {
    const regex = /\/([^\/]+)$/
    return upperFirst(regex.exec(path)[1])
}

/* 获取两点与原点形成的夹角角度
*  @params {Number} ox原点x坐标
*  @params {Number} oy原点x坐标
*  @params {Number} startX起始点x坐标
*  @params {Number} startY起始点y坐标
*  @params {Number} endX终点x坐标
*  @params {Number} endY终点y坐标
*  */
export const getAngle = (ox, oy, startX, startY, endX, endY) => {
    let circle1 = (Math.atan2(startY - oy, startX - ox) * 180) / Math.PI
    let circle2 = (Math.atan2(endY - oy, endX - ox) * 180) / Math.PI
    let angle
    circle1 = circle1 <= -90 ? 360 + circle1 : circle1
    circle2 = circle2 <= -90 ? 360 + circle2 : circle2
    angle = Math.floor(circle2 - circle1)
    angle = angle < 0 ? angle + 360 : angle
    return angle
}
