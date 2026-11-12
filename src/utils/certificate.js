import {t,getLang} from '../i18n/index.js';
const SERIF='Georgia,serif',SANS='sans-serif';
export function certificate(name,rankName,xp){const c=document.createElement('canvas');c.width=1200;c.height=850;const x=c.getContext('2d');
const g=x.createLinearGradient(0,0,0,850);g.addColorStop(0,'#0b1030');g.addColorStop(1,'#2b1d6b');x.fillStyle=g;x.fillRect(0,0,1200,850);
x.strokeStyle='#ffd34e';x.lineWidth=8;x.strokeRect(40,40,1120,770);x.lineWidth=2;x.strokeRect(60,60,1080,730);
x.fillStyle='#fff';for(let i=0;i<90;i++){x.globalAlpha=Math.random()*.7;x.fillRect(Math.random()*1200,Math.random()*850,2,2)}x.globalAlpha=1;
x.textAlign='center';x.fillStyle='#ffd34e';x.font='bold 30px '+SANS;x.fillText(t('cert.event'),600,150);
x.fillStyle='#fdf3e2';x.font='bold 78px '+SERIF;x.fillText(t('cert.title'),600,260);x.font='34px '+SANS;x.fillText(t('cert.subtitle'),600,315);
x.font='28px '+SANS;x.fillText(t('cert.awarded'),600,420);x.fillStyle='#ffd34e';x.font='bold 74px '+SERIF;x.fillText(name||t('cert.defaultName'),600,510);
x.fillStyle='#fdf3e2';x.font='28px '+SANS;x.fillText(t('cert.reason'),600,590);x.fillText(t('cert.line',{rank:rankName,xp,date:new Date().toLocaleDateString(getLang())}),600,650);
x.font='60px serif';x.fillText('🚀 🌙 🔴 ⭐',600,740);const a=document.createElement('a');a.download=t('cert.fileName');a.href=c.toDataURL('image/png');a.click()}
