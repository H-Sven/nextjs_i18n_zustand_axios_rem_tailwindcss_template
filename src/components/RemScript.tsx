'use client'

import Script from 'next/script'

/**
 * 移动端适配 REM 脚本
 * 假设设计稿宽度 375px，1rem = 16px
 */
export default function RemScript() {
  return (
    <Script id="rem-script" strategy="afterInteractive">
      {`
        (function() {
          function setRem() {
            var docEl = document.documentElement;
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            // 限制最大宽度，例如在桌面端显示时不超过某个宽度，或者直接全屏适配
            // 这里简单全屏适配
            docEl.style.fontSize = 16 * (clientWidth / 375) + 'px';
          }
          setRem();
          window.addEventListener('resize', setRem);
        })();
      `}
    </Script>
  )
}
