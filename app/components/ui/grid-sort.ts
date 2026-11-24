// Resolve expensive accessors only once per row rather than on every comparison.
// Native stable sort preserves equal-key order in both directions.
export function sortGridRows<Row>(rows:readonly Row[],accessor:(row:Row)=>unknown,direction:"asc"|"desc"):Row[]{
 const collator=new Intl.Collator("zh",{numeric:true});
 const decorated=rows.map(row=>({row,value:accessor(row)}));
 decorated.sort((a,b)=>{
   const av=a.value,bv=b.value;
   const order=typeof av==="number"&&typeof bv==="number"?av-bv:collator.compare(String(typeof av==="object"?"":av??""),String(typeof bv==="object"?"":bv??""));
   return direction==="asc"?order:-order;
 });
 return decorated.map(entry=>entry.row);
}
