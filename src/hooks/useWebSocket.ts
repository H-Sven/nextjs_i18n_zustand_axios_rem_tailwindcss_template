import { useCallback, useEffect, useRef, useState } from 'react'

interface WebSocketOptions {
  url: string
  onOpen?: () => void
  onMessage?: (data: any) => void
  onClose?: () => void
  onError?: (error: Event) => void
  reconnectInterval?: number
  autoReconnect?: boolean
  heartbeatInterval?: number // 心跳间隔，默认 30000ms
  heartbeatMessage?: string | object // 心跳消息内容，默认 'ping'
}

/**
 * WebSocket Hook 封装
 */
export const useWebSocket = ({
  url,
  onOpen,
  onMessage,
  onClose,
  onError,
  reconnectInterval = 3000,
  autoReconnect = true,
  heartbeatInterval = 30000,
  heartbeatMessage = 'ping',
}: WebSocketOptions) => {
  const ws = useRef<WebSocket | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const reconnectTimer = useRef<NodeJS.Timeout | null>(null)
  const heartbeatTimer = useRef<NodeJS.Timeout | null>(null)
  const connectRef = useRef<() => void>(() => {})

  // 记录是否是用户手动断开
  const shouldReconnect = useRef<boolean>(true)

  // 启动心跳
  const startHeartbeat = useCallback(() => {
    if (heartbeatTimer.current) {
      clearInterval(heartbeatTimer.current)
    }
    heartbeatTimer.current = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(
          typeof heartbeatMessage === 'string'
            ? heartbeatMessage
            : JSON.stringify(heartbeatMessage),
        )
      }
    }, heartbeatInterval)
  }, [heartbeatInterval, heartbeatMessage])

  // 停止心跳
  const stopHeartbeat = useCallback(() => {
    if (heartbeatTimer.current) {
      clearInterval(heartbeatTimer.current)
      heartbeatTimer.current = null
    }
  }, [])

  const connect = useCallback(() => {
    if (!url) return

    shouldReconnect.current = true

    // 防止重复连接
    if (
      ws.current?.readyState === WebSocket.OPEN ||
      ws.current?.readyState === WebSocket.CONNECTING
    ) {
      return
    }

    try {
      ws.current = new WebSocket(url)

      ws.current.onopen = () => {
        setIsConnected(true)
        onOpen?.()
        startHeartbeat()

        // 清除重连定时器
        if (reconnectTimer.current) {
          clearTimeout(reconnectTimer.current)
          reconnectTimer.current = null
        }
      }

      ws.current.onmessage = (event) => {
        onMessage?.(event.data)
      }

      ws.current.onclose = () => {
        setIsConnected(false)
        stopHeartbeat()
        onClose?.()

        // 只有在允许自动重连且不是手动断开的情况下才重连
        if (autoReconnect && shouldReconnect.current) {
          reconnectTimer.current = setTimeout(() => {
            connectRef.current()
          }, reconnectInterval)
        }
      }

      ws.current.onerror = (error) => {
        onError?.(error)
        // 出错时关闭连接，触发重连逻辑
        if (ws.current?.readyState !== WebSocket.CLOSED) {
          ws.current?.close()
        }
      }
    } catch (e) {
      console.error('WebSocket connection failed:', e)
      if (autoReconnect && shouldReconnect.current) {
        reconnectTimer.current = setTimeout(() => {
          connectRef.current()
        }, reconnectInterval)
      }
    }
  }, [
    url,
    onOpen,
    onMessage,
    onClose,
    onError,
    reconnectInterval,
    autoReconnect,
    startHeartbeat,
    stopHeartbeat,
  ])

  // 手动断开连接
  const disconnect = useCallback(() => {
    shouldReconnect.current = false
    stopHeartbeat()
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current)
      reconnectTimer.current = null
    }
    if (ws.current) {
      ws.current.close()
    }
  }, [stopHeartbeat])

  // 手动重新连接
  const reconnect = useCallback(() => {
    disconnect()
    // 稍作延迟以确保完全断开
    setTimeout(() => {
      connect()
    }, 100)
  }, [connect, disconnect])

  useEffect(() => {
    connectRef.current = connect
  }, [connect])

  useEffect(() => {
    connect()
    return () => {
      shouldReconnect.current = false
      if (ws.current) {
        ws.current.onclose = null // 防止触发重连
        ws.current.close()
      }
      stopHeartbeat()
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current)
      }
    }
  }, [connect, stopHeartbeat])

  const sendMessage = (message: string | object) => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(typeof message === 'string' ? message : JSON.stringify(message))
    } else {
      console.warn('WebSocket is not connected')
    }
  }

  return {
    sendMessage,
    connect,
    disconnect,
    reconnect,
    isConnected,
    ws,
  }
}
