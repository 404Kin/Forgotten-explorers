export const $=(s,r=document)=>r.querySelector(s);
export const $$=(s,r=document)=>[...r.querySelectorAll(s)];
export const shuffle=a=>{a=[...a];for(let i=a.length-1;i>0;i--){const j=Math.random()*(i+1)|0;[a[i],a[j]]=[a[j],a[i]]}return a};
export const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
export const fKm=k=>k>=1e9?(k/1e9).toFixed(1)+' billion km':k>=1e6?(k/1e6).toFixed(k>=1e8?0:1)+' million km':Math.round(k).toLocaleString()+' km';
export const fTime=s=>s>=3600?(s/3600).toFixed(1)+' hours':s>=60?Math.round(s/60)+' minutes':s+' seconds';
