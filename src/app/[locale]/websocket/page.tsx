'use client';

import { useCallback, useState } from 'react';

import { useTranslations } from 'next-intl';

import { formatDateTime } from '@/lib/dayjs';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { useWebSocket } from '@/hooks/useWebSocket';

interface Message {
  id: number;
  content: string;
  time: string;
  type: 'sent' | 'received';
}

export default function WebSocketPage() {
  const t = useTranslations('WebSocket');
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');

  const handleMessage = useCallback((data: any) => {
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        content: String(data),
        time: formatDateTime(new Date()),
        type: 'received',
      },
    ]);
  }, []);

  const { sendMessage, isConnected, disconnect, reconnect } = useWebSocket({
    url: 'wss://echo.websocket.org', // 公共测试服务
    onMessage: handleMessage,
    reconnectInterval: 3000,
    heartbeatInterval: 5000, // 为了演示效果，缩短心跳间隔
    heartbeatMessage: 'heartbeat',
  });

  const handleSend = () => {
    if (!inputValue.trim()) return;

    sendMessage(inputValue);
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        content: inputValue,
        time: formatDateTime(new Date()),
        type: 'sent',
      },
    ]);
    setInputValue('');
  };

  return (
    <div className="container mx-auto max-w-2xl p-8">
      <h1 className="mb-6 text-3xl font-bold">{t('title')}</h1>

      <div className="mb-6 rounded-lg border p-4 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <span className="font-semibold">{t('status')}:</span>
          <span
            className={`inline-block h-3 w-3 rounded-full ${
              isConnected ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span>{isConnected ? t('connected') : t('disconnected')}</span>
        </div>

        <div className="flex gap-2">
          <Button variant="destructive" onClick={disconnect} disabled={!isConnected} size="sm">
            {t('disconnect')}
          </Button>
          <Button variant="outline" onClick={reconnect} disabled={isConnected} size="sm">
            {t('reconnect')}
          </Button>
        </div>
      </div>

      <div className="mb-6">
        <div className="mb-2 font-semibold">{t('messageLabel')}</div>
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t('placeholder')}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
          <Button onClick={handleSend} disabled={!isConnected}>
            {t('send')}
          </Button>
        </div>
      </div>

      <div className="rounded-lg border p-4 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold">{t('received')}</h3>
        <div className="h-96 space-y-2 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="py-8 text-center text-gray-500">No messages</div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.type === 'sent' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    msg.type === 'sent' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}
                >
                  {msg.content}
                </div>
                <span className="mt-1 text-xs text-gray-500">{msg.time}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
