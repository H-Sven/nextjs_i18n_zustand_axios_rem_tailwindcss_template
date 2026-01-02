'use client';

import { useEffect, useTransition } from 'react';

import { useLocale, useTranslations } from 'next-intl';

import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useAppStore } from '@/store/appStore';

import { Button } from '@/components/ui/button';

export default function HomePage() {
  const t = useTranslations('HomePage');
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();
  const { setLocale } = useAppStore();

  // 同步当前语言到 store
  useEffect(() => {
    setLocale(locale as any);
  }, [locale, setLocale]);

  const handleSwitchLocale = (nextLocale: string) => {
    startTransition(() => {
      setLocale(nextLocale as any);
      router.replace(pathname, { locale: nextLocale });
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 p-24">
      <h1 className="mb-4 text-4xl font-bold">{t('title')}</h1>
      <p className="mb-8">{t('welcome')}</p>

      <div className="flex gap-4">
        <Link href="/login">
          <Button>Go to Login</Button>
        </Link>

        <Link href="/websocket">
          <Button variant="secondary">WebSocket Demo</Button>
        </Link>

        <Button
          variant="outline"
          onClick={() => handleSwitchLocale(locale === 'zh' ? 'en' : 'zh')}
          disabled={isPending}
        >
          {isPending ? 'Switching...' : locale === 'zh' ? 'Switch to English' : '切换到中文'}
        </Button>
      </div>
    </div>
  );
}
