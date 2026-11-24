"use client";
import {useEffect,useState} from "react";
type Cursor={year:number;month:number};
export function useCalendarMonth(initial:Cursor,initialDay:number){
 const [cursor,setCursor]=useState(initial),[selected,setSelected]=useState(initialDay);
 const [todayDate,setTodayDate]=useState<Date|null>(null);
 useEffect(()=>setTodayDate(new Date()),[]);
 const days=new Date(cursor.year,cursor.month+1,0).getDate();
 const first=(new Date(cursor.year,cursor.month,1).getDay()+6)%7;
 const cells:(number|null)[]=[...Array<null>(first).fill(null),...Array.from({length:days},(_,i)=>i+1)];
 while(cells.length%7)cells.push(null);
 const shift=(delta:number)=>{setCursor(previous=>{const date=new Date(previous.year,previous.month+delta,1);return {year:date.getFullYear(),month:date.getMonth()}});setSelected(1)};
 const goToday=()=>{const date=new Date();setTodayDate(date);setCursor({year:date.getFullYear(),month:date.getMonth()});setSelected(date.getDate())};
 const today=todayDate&&todayDate.getFullYear()===cursor.year&&todayDate.getMonth()===cursor.month?todayDate.getDate():0;
 return {cursor,month:cursor.year+"年"+(cursor.month+1)+"月",selected,setSelected,cells,today,shift,goToday};
}
