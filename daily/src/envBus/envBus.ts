// 事件总线类型定义
export type EventName = string;
export type EventCallback<T = any> = (payload: T) => void;

// 预定义的事件名称常量
export const Events = Object.freeze({
  Button_edit: 'button:edit' as EventName,
  Button_view: 'button:view' as EventName,
  Button_type: 'button:type' as EventName,
  Button_contentName: 'button:docsId' as EventName
});

// SimpleEventBus 类 - 简单事件总线实现
export class SimpleEventBus {
  private listeners: Map<EventName, Set<EventCallback>>;

  constructor() {
    this.listeners = new Map();
  }

  /**
   * 订阅事件
   * @param event - 事件名称
   * @param callback - 回调函数
   */
  $on<T = any>(event: EventName, callback: EventCallback<T>): void {
    if (typeof callback !== 'function') {
      console.warn(`[EventBus] listener for "${event}" is not a function.`);
      return;
    }
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event)!.add(callback);
  }

  /**
   * 取消订阅事件
   * @param event - 事件名称
   * @param callback - 回调函数
   */
  $off(event: EventName, callback: EventCallback): void {
    const eventListeners = this.listeners.get(event);
    if (!eventListeners) {
      return;
    }

    eventListeners.delete(callback);
    if (eventListeners.size === 0) {
      this.listeners.delete(event);
    }
  }

  /**
   * 触发事件
   * @param event - 事件名称
   * @param payload - 事件数据
   */
  $emit<T = any>(event: EventName, payload: T): void {
    const eventListeners = this.listeners.get(event);
    if (!eventListeners) {
      return;
    }

    for (const callback of [...eventListeners]) {
      try {
        callback(payload);
      } catch (error) {
        console.error(`[EventBus] listener for "${event}" threw an error:`, error);
      }
    }
  }
}

// 导出事件总线实例
export const EventBus = new SimpleEventBus();
