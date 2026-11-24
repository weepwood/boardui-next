// Prefix sums in O(series × points), rather than re-summing every prior series.
export function stackSeries(series:readonly {data:readonly number[]}[],points:number){
 const total=Array<number>(points).fill(0);
 const baselines=series.map(s=>{
   const base=total.slice();
   for(let i=0;i<points;i++)total[i]+=s.data[i]??0;
   return base;
 });
 return {baselines,total};
}
