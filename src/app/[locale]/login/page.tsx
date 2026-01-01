'use client'

import { useState } from 'react'

import { useTranslations } from 'next-intl'

import { useRouter } from '@/i18n/routing'
import { useUserStore } from '@/store/userStore'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const t = useTranslations('LoginPage')
  const router = useRouter()
  const setToken = useUserStore((state) => state.setToken)
  const setUserInfo = useUserStore((state) => state.setUserInfo)

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleLogin = () => {
    // 模拟登录
    setToken('fake-token-123')
    setUserInfo({ name: username })
    router.push('/')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md dark:bg-gray-800">
        <h2 className="mb-6 text-center text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t('title')}
        </h2>
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('username')}
            </label>
            <Input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder={t('username')}
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
              {t('password')}
            </label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('password')}
            />
          </div>
          <Button className="w-full" onClick={handleLogin}>
            {t('submit')}
          </Button>
        </div>
      </div>
    </div>
  )
}
