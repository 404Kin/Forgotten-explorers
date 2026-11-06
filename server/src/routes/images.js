import {parseQuery} from '../lib/validate.js';
import {notFound,upstreamUnavailable} from '../lib/errors.js';

const NASA_SEARCH='https://images-api.nasa.gov/search';
const IMAGE_ASSETS='https://images-assets.nasa.gov/image/';
const CACHE_TTL=6*60*60*1000;
const CACHE_SECONDS=CACHE_TTL/1000;
const ID=/^[A-Za-z0-9_-]{1,100}$/;
const ROBOT_ID={type:'string',required:true,max:40,pattern:/^[a-z0-9-]{2,40}$/};

const text=(value,max=500)=>typeof value==='string'?value.replace(/<[^>]*>/g,'').trim().slice(0,max):'';
const trustedAsset=url=>{
  try{const u=new URL(url);return u.protocol==='https:'&&u.hostname==='images-assets.nasa.gov'}catch{return false}
};

function mapImage(item){
  const record=item?.data?.[0];
  if(!record||record.media_type!=='image'||typeof record.nasa_id!=='string'||!ID.test(record.nasa_id))return null;
  const id=record.nasa_id,links=Array.isArray(item.links)?item.links.filter(l=>trustedAsset(l?.href)):[];
  const base=`${IMAGE_ASSETS}${encodeURIComponent(id)}/${encodeURIComponent(id)}`;
  const thumb=links.find(l=>l.rel==='preview')?.href||`${base}~thumb.jpg`;
  const medium=links.find(l=>l.rel==='alternate'&&Number(l.width)>=960)?.href||`${base}~medium.jpg`;
  return{
    id,
    title:text(record.title,200)||id,
    desc:text(record.description_508||record.description),
    date:text(record.date_created,10),
    credit:text(record.secondary_creator||record.center,200)||'NASA',
    link:`https://images.nasa.gov/details/${encodeURIComponent(id)}`,
    thumb,
    medium,
    pinned:false
  };
}

export function registerImages(router){
  const cache=new Map();
  router.add('GET','/api/v1/images',async({url,data,fetchImpl,logger})=>{
    const q=parseQuery(url,{robotId:ROBOT_ID});
    const robot=data.robots.get(q.robotId);
    if(!robot)throw notFound(`No robot with id "${q.robotId}"`);
    const cached=cache.get(robot.id);
    const now=Date.now();
    if(cached&&now-cached.time<CACHE_TTL)return{body:cached.body,cacheSeconds:CACHE_SECONDS};

    const search=new URL(NASA_SEARCH);
    search.searchParams.set('q',robot.name);
    search.searchParams.set('media_type','image');
    search.searchParams.set('page_size','20');
    try{
      const response=await fetchImpl(search,{headers:{Accept:'application/json'},signal:AbortSignal.timeout(8000)});
      if(!response.ok)throw new Error(`NASA Image Library returned HTTP ${response.status}`);
      const payload=await response.json();
      if(!Array.isArray(payload?.collection?.items))throw new Error('NASA Image Library returned an invalid response');
      const images=payload.collection.items.map(mapImage).filter(Boolean).slice(0,12);
      const body={data:images,meta:{robotId:robot.id,count:images.length,source:'NASA Image and Video Library',asOf:new Date(now).toISOString(),stale:false}};
      cache.set(robot.id,{time:now,body});
      return{body,cacheSeconds:CACHE_SECONDS};
    }catch(error){
      logger.warn('nasa_images_unavailable',{robotId:robot.id,error:String(error?.message||error)});
      if(cached)return{body:{...cached.body,meta:{...cached.body.meta,stale:true}},cacheSeconds:60};
      throw upstreamUnavailable('NASA Image and Video Library');
    }
  });
}
