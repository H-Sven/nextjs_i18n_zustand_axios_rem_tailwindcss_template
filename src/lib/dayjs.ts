import dayjs, { ConfigType, Dayjs } from 'dayjs';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import relativeTime from 'dayjs/plugin/relativeTime';

import 'dayjs/locale/zh-cn';
import 'dayjs/locale/en';

// 配置插件
dayjs.extend(relativeTime);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

// 默认语言
dayjs.locale('zh-cn');

export const DATE_TEMPLATE = 'YYYY-MM-DD';
export const TIME_TEMPLATE = 'HH:mm:ss';
export const DATETIME_TEMPLATE = 'YYYY-MM-DD HH:mm:ss';

/**
 * 设置语言
 * @param locale 语言代码 ('zh' | 'en')
 */
export const setLocale = (locale: string) => {
  const map: Record<string, string> = {
    zh: 'zh-cn',
    en: 'en',
  };
  dayjs.locale(map[locale] || 'zh-cn');
};

/**
 * 格式化日期时间
 * @param date 日期
 * @param template 模板 (默认 YYYY-MM-DD HH:mm:ss)
 */
export const formatDateTime = (date?: ConfigType, template: string = DATETIME_TEMPLATE): string => {
  return dayjs(date).format(template);
};

/**
 * 格式化日期
 * @param date 日期
 * @param template 模板 (默认 YYYY-MM-DD)
 */
export const formatDate = (date?: ConfigType, template: string = DATE_TEMPLATE): string => {
  return dayjs(date).format(template);
};

/**
 * 获取相对时间 (如：几分钟前)
 * @param date 日期
 */
export const fromNow = (date: ConfigType): string => {
  return dayjs(date).fromNow();
};

/**
 * 获取 Unix 时间戳 (秒)
 * @param date 日期
 */
export const getUnix = (date?: ConfigType): number => {
  return dayjs(date).unix();
};

/**
 * 获取时间戳 (毫秒)
 * @param date 日期
 */
export const getValueOf = (date?: ConfigType): number => {
  return dayjs(date).valueOf();
};

/**
 * 判断日期是否在之前
 * @param date 待比较日期
 * @param compareDate 比较基准日期
 */
export const isBefore = (date: ConfigType, compareDate?: ConfigType): boolean => {
  return dayjs(date).isBefore(compareDate);
};

/**
 * 判断日期是否在之后
 * @param date 待比较日期
 * @param compareDate 比较基准日期
 */
export const isAfter = (date: ConfigType, compareDate?: ConfigType): boolean => {
  return dayjs(date).isAfter(compareDate);
};

/**
 * 获取 Dayjs 对象
 * @param date 日期
 */
export const getDayjs = (date?: ConfigType): Dayjs => {
  return dayjs(date);
};

export default dayjs;
