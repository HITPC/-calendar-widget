import { 
  getWeekday, getPreMonthCount, getNextMonthCount, beApartDays, getMonthCount, sortDates 
} from "./dateTools.js";

const forWhatInput = document.getElementById("forWhat"); // 主题input
const lastDate = document.getElementById("lastDate"); // 上次日期
const howManyDays = document.getElementById("howManyDays"); // 距今
const longestRecord = document.getElementById("longestRecord"); // 最长纪录
const d = new Date();
// 默认选中日期为当天
let selectedYear = d.getFullYear();
let selectedMounth = d.getMonth()+1;
let selectedDate = d.getDate();

function initContent(){
  // 进行初始化
  const title = localStorage.getItem("title") || "";
  let ls = JSON.parse(localStorage.getItem("last"));
  let last;
  if(ls){
    let arr = sortDates(ls)
    last = arr[0].year+"-"+arr[0].mounth+"-"+arr[0].day;
  }else{
    last = d.getFullYear()+"-"+(Number.parseInt(d.getMonth())+1)+"-"+d.getDate();
  }
  const howMany = beApartDays(last);
  let longest = localStorage.getItem("longest") || 0;
  longest = Number.parseInt(longest);
  if(beApartDays(last, d.getFullYear()+"-"+(Number.parseInt(d.getMonth())+1)+"-"+d.getDate())>longest){
    longest = beApartDays(last, d.getFullYear()+"-"+(Number.parseInt(d.getMonth())+1)+"-"+d.getDate());
    localStorage.setItem("longest", longest);
  }
  forWhatInput.value = title;
  lastDate.innerHTML = last;
  howManyDays.innerHTML = howMany;
  longestRecord.innerHTML = longest;
}

const calendar = document.getElementById("calendar");
const selectedDay = document.getElementById("selectedDay");
const selectedOne = {};
let allDates;
let allRow;
function renderDay(year, mounth){
  // 获取本年本月日期情况，并填入到日历中
  let weekdayFirst = getWeekday(year, mounth-1);
  let arr = [];
  allRow = [];
  let mounthDay = getMonthCount(year, mounth-1);// 数组
  for(let i = 0; i < 5; ++i){// 创造出来先
    let row = document.createElement("div");
    row.classList.add("calendar-row");
    for(let j = 0; j < 7; ++j){
      let item = document.createElement("div");
      item.classList.add("calendar-item");
      item.classList.add("calendar-date");
      row.appendChild(item);
    }
    arr.push(row);
    allRow.push(row);
  }
  let firstOK = false;
  let week = 0;
  arr.forEach((row, index)=>{
    let temp = Array.from(row.children);
    temp.forEach((item, weekDay)=>{
      if(firstOK && mounthDay[week] === d.getDate()){
        if(selectedMounth-1 === d.getMonth()){
          item.classList.add("calendar-date-focus");
        }
        item.classList.add("calendar-date-selected");
        selectedDay.innerHTML = 
          selectedYear+"-"+selectedMounth+"-"+selectedDate;
        // 默认选中
        selectedOne.year = selectedYear;
        selectedOne.mounth = selectedMounth;
        selectedOne.day = selectedDate;
        selectedOne.isViolate = false;
        selectedOne.element = item;    
      }
      if(index === 0 && weekDay === weekdayFirst){
        item.innerHTML = mounthDay[week];
        ++week;
        firstOK = true;
      }else if(firstOK && week < mounthDay.length){
        item.innerHTML = mounthDay[week];
        ++week;
      }
      item.addEventListener("click", (e)=>{
        if(selectedOne.element){
          selectedOne.element.classList.remove("calendar-date-selected");
        }
        e.target.classList.add("calendar-date-selected");
        selectedOne.year = selectedYear;
        selectedOne.mounth = selectedMounth;
        selectedOne.day = Number.parseInt(e.target.innerHTML);
        selectedOne.isViolate = false;
        selectedOne.element = e.target;
        selectedDate = selectedOne.day;
        selectedDay.innerHTML = 
          selectedYear+"-"+selectedMounth+"-"+selectedDate;    
        // console.log(selectedOne);
      });
    });
    calendar.appendChild(row);
  });
  allDates = document.querySelectorAll(".calendar-date");
  resetStyle();
}

function resetStyle(){
  if(allDates){
    let ls = JSON.parse(localStorage.getItem("last"));
    if(!ls){
      return;
    }else{
      // 找到可能的进行标红
      let arrY = ls.filter((item)=>{return item.year === selectedYear});// 当年的
      let arrM = arrY.filter((item)=>{return item.mounth === selectedMounth}); // 当月的
      let we = getWeekday(selectedYear, selectedMounth-1);
      arrM.forEach((item)=>{
        allDates[Number.parseInt(item.day)-1+we]
          .classList.add("calendar-date-violate");
      });
    }
  }
}

function deleteDate(){// 清空当前的生成的日期项
  allRow.forEach((item)=>{
    calendar.removeChild(item);
  });
}

const violate = document.getElementById("violate");
violate.addEventListener("click", ()=>{
  if(selectedOne.element){
    if(selectedOne.year>d.getFullYear()){
      alert("还未到来！");
      return;
    }else if(selectedOne.year===d.getFullYear()&&selectedOne.mounth-1>d.getMonth()){
      alert("还未到来！");
      return;
    }else if(selectedOne.year===d.getFullYear()&&selectedOne.mounth-1===d.getMonth()
      && selectedOne.day > d.getDate()
    ){
      alert("还未到来！");
      return;
    }
    let is = 
      confirm(`确定在${selectedOne.year}-${selectedOne.mounth}-${selectedOne.day}违反了规则？`);
    if(!is){
      return;
    }
    selectedOne.isViolate = true;
    let ls = JSON.parse(localStorage.getItem("last"));
    if(!ls){
      ls = [];
    }
    if(!ls.find((item)=>
      {return item.year===selectedOne.year&&item.mounth===selectedOne.mounth&&item.day===selectedOne.day}
    )){// 没有才push
      ls.push({
        year: selectedOne.year,
        mounth: selectedOne.mounth,
        day: selectedOne.day,
      });
    }
    localStorage.setItem("last", JSON.stringify(ls));
    resetStyle();
    initContent();
  }else{
    alert("请先选中一个日期");
    return;
  }
});

initContent();
renderDay(selectedYear, selectedMounth);

let temp = "";
forWhatInput.addEventListener("change", (e)=>{
  temp = e.target.value;
});

forWhatInput.onblur = ()=>{
  localStorage.setItem("title", temp);
}

// 切换日期
const lbtn = document.getElementById("prev");
const rbtn = document.getElementById("next");
lbtn.addEventListener("click", ()=>{
  if(selectedMounth-1<1){
    selectedYear--;
    selectedMounth = 12;
  }else{
    selectedMounth--;
  }
  // 先删除
  deleteDate();
  // 再重画
  renderDay(selectedYear, selectedMounth);
});
rbtn.addEventListener("click", ()=>{
  if(selectedMounth+1>12){
    selectedYear++;
    selectedMounth = 1;
  }else{
    selectedMounth++;
  }
  // 先删除
  deleteDate();
  // 再重画
  renderDay(selectedYear, selectedMounth);
});