import mitt from 'mitt'

type Events = Record<string, any>

/**
 * 全局事件总线 (基于 mitt)
 */
export const eventBus = mitt<Events>()
