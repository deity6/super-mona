import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { SuperMona } from './ui/SuperMona.jsx';
import './ui/page.css';

/** 竖屏提示的文案。动作按钮上的字不翻译 —— 那是像素字模拼的，只用大写英文。 */
const HINT = {
  en: 'Turn your phone sideways · it is a side-scroller',
  zh: '把手机横过来玩 · 这是横版跑酷',
};

/**
 * 右上角那个语言开关是 `index.html` 里一段普通脚本控制的，它只改 `<html lang>`
 * 和带 `data-en` 的节点文本，不经过 React。这里盯着那个属性，需要跟着走的文案
 * 才跟得上。
 *
 * 那段脚本是同步执行的，module 脚本是 deferred，所以挂载时语言已经定了 —— 初值
 * 直接读一次就够，观察器是给之后的切换用的。
 */
function useDocLang() {
  const [lang, setLang] = useState(() => (document.documentElement.lang || 'en').slice(0, 2));
  useEffect(() => {
    const el = document.documentElement;
    const observer = new MutationObserver(() => setLang((el.lang || 'en').slice(0, 2)));
    observer.observe(el, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, []);
  return lang;
}

function App() {
  const lang = useDocLang();
  return <SuperMona portraitHint={lang === 'zh' ? HINT.zh : HINT.en} />;
}

// 不套 StrictMode：开发模式下会让 Effect 双跑，WebGL 上下文被创建两次
createRoot(document.getElementById('root')).render(<App />);
