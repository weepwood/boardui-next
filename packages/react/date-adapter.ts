import { CalendarDate, getLocalTimeZone } from "@internationalized/date";
export const toCalendarDate=(date?:Date|null)=>date&&Number.isFinite(date.getTime())?new CalendarDate(date.getFullYear(),date.getMonth()+1,date.getDate()):null;
export const fromCalendarDate=(date:CalendarDate)=>date.toDate(getLocalTimeZone());
