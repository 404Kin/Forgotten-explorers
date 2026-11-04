export function certificate(name,rankName,xp){const c=document.createElement('canvas');c.width=1200;c.height=850;const x=c.getContext('2d');
const g=x.createLinearGradient(0,0,0,850);g.addColorStop(0,'#0b1030');g.addColorStop(1,'#2b1d6b');x.fillStyle=g;x.fillRect(0,0,1200,850);
x.strokeStyle='#ffd34e';x.lineWidth=8;x.strokeRect(40,40,1120,770);x.lineWidth=2;x.strokeRect(60,60,1080,730);
x.fillStyle='#fff';for(let i=0;i<90;i++){x.globalAlpha=Math.random()*.7;x.fillRect(Math.random()*1200,Math.random()*850,2,2)}x.globalAlpha=1;
x.textAlign='center';x.fillStyle='#ffd34e';x.font='bold 30px sans-serif';x.fillText('◇  NASA SPACE APPS 2026  ◇',600,150);
x.fillStyle='#fdf3e2';x.font='bold 78px Georgia';x.fillText('Space Explorer',600,260);x.font='34px sans-serif';x.fillText('Certificate of Discovery',600,315);
x.font='28px sans-serif';x.fillText('proudly awarded to',600,420);x.fillStyle='#ffd34e';x.font='bold 74px Georgia';x.fillText(name||'A Curious Explorer',600,510);
x.fillStyle='#fdf3e2';x.font='28px sans-serif';x.fillText('for waking up all 11 forgotten robots and learning their stories',600,590);x.fillText(`Rank: ${rankName}  ·  ${xp} XP  ·  ${new Date().toLocaleDateString()}`,600,650);
x.font='60px serif';x.fillText('🚀 🌙 🔴 ⭐',600,740);const a=document.createElement('a');a.download='space-explorer-certificate.png';a.href=c.toDataURL('image/png');a.click()}
