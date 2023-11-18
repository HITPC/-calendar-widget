import { getWeekday, getPreMonthCount, getNextMonthCount, beApartDays } from "./dateTools.js";

const forWhatInput = document.getElementById("forWhat"); // 主题input
const lastDate = document.getElementById("lastDate"); // 上次日期
const howManyDays = document.getElementById("howManyDays"); // 距今
const longestRecord = document.getElementById("longestRecord"); // 最长纪录

let temp = "";

function initContent(){
  // 进行初始化
  let d = new Date();
  let title = localStorage.getItem("title") || "";
  let last = localStorage.getItem("last") || d.getFullYear()+"-"+(Number.parseInt(d.getMonth())+1)+"-"+d.getDate();
  let longestRecord = localStorage.getItem("longest") || "0";
  
}

function renderDay(){
  // 获取本月日期情况，并填入到日历中
}