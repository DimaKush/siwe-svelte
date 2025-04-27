import { writable } from 'svelte/store';

// Обычно языковые настройки сохраняются и загружаются из localStorage
const getBrowserLanguage = (): string => {
  if (typeof window === 'undefined') return 'ru'; // Значение по умолчанию для SSR
  
  // Проверяем, есть ли сохраненный язык
  const savedLang = localStorage.getItem('app_language');
  if (savedLang === 'en' || savedLang === 'ru' || savedLang === 'zh') return savedLang;
  
  // Если нет, пробуем определить по браузеру
  const browserLang = navigator.language.substring(0, 2).toLowerCase();
  if (browserLang === 'en') return 'en';
  if (browserLang === 'zh') return 'zh';
  return 'en'; // Fallback to Russian
};

// Создаем хранилище
export const currentLang = writable<string>(getBrowserLanguage());

// Подписываемся на изменения и сохраняем их
if (typeof window !== 'undefined') {
  currentLang.subscribe(value => {
    localStorage.setItem('app_language', value);
  });
}

// Функция для смены языка
export function toggleLanguage(): void {
  currentLang.update(lang => {
    if (lang === 'en') return 'ru';
    if (lang === 'ru') return 'zh';
    return 'en';
  });
} 