// One generic, read-only repository for any list of records (robots today, anything tomorrow). No per-robot code.
export function createRepository(items,{sortBy='name'}={}){
  const all=[...items].sort((a,b)=>String(a[sortBy]).localeCompare(String(b[sortBy])));
  const byId=new Map(all.map(i=>[i.id,i]));
  return{
    count:()=>all.length,
    get:id=>byId.get(id)??null,
    // filters: { world:'mars', status:undefined } - undefined values are ignored
    list({filters={},page=1,pageSize=12}={}){
      const rows=all.filter(r=>Object.entries(filters).every(([k,v])=>v==null||r[k]===v));
      const total=rows.length,totalPages=Math.max(1,Math.ceil(total/pageSize));
      return{items:rows.slice((page-1)*pageSize,page*pageSize),meta:{page,pageSize,total,totalPages}};
    }
  };
}
