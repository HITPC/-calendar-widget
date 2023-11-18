// 1.为了获得每个月的日期有多少，我们需要判断 平年闰年[四年一闰，百年不闰，四百年再闰]
export const isLeapYear = (year) => {
  return (year % 400 === 0) || (year % 100 !== 0 && year % 4 === 0);
};

// 2.获得每个月的日期有多少，注意 month - [0-11]
export const getMonthCount = (year, month) => {
  let arr = [
    31, null, 31, 30, 
    31, 30, 31, 31,
    30, 31, 30, 31
  ];
  let count = arr[month] || (isLeapYear(year) ? 29 : 28);
  return Array.from(new Array(count), (item, value) => value + 1);
};

// 3.获得某年某月的 1号 是星期几，这里要注意的是 JS 的 API-getDay() 是从 [日-六](0-6)，返回 number
export const getWeekday = (year, month) => {
  let date = new Date(year, month, 1);
  return date.getDay();
};

// 4.获得上个月的天数
export const getPreMonthCount = (year, month) => {
  if (month === 0) {
    return getMonthCount(year - 1, 11);// 一月份用上一年的
  } else {
    return getMonthCount(year, month - 1);
  }
};

// 5.获得下个月的天数
export const getNextMonthCount = (year, month) => {
  if (month === 11) {
    return getMonthCount(year + 1, 0);// 12月份用下一年的
  } else {
    return getMonthCount(year, month + 1);
  }
};

/**
 * 计算两个日期相隔多少天，不限制先后顺序
 * @param {Date} Date_start 开始时间
 * @param {Date} Date_end 结束时间
 * @returns 相隔天数
 * 可传一个参数，第二个参数不传为当前日期
 * 传递格式2023-11-01
 */
export const beApartDays = (Date_start, Date_end = new Date()) => {
  // 时间格式化
  let date1 = new Date(Date_start);
  let date2 = new Date(Date_end);
  date1 = new Date(date1.getFullYear(), date1.getMonth(), date1.getDate());
  date2 = new Date(date2.getFullYear(), date2.getMonth(), date2.getDate());
  //目标时间减去当前时间
  const diff = date1.getTime() - date2.getTime();
  //计算当前时间与结束时间之间相差天数
  return Math.abs(diff) / (24 * 60 * 60 * 1000);
};
