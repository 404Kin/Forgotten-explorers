// One error shape for every endpoint: { error: { code, message, details } }
export class AppError extends Error{
  constructor(status,code,message,details={}){super(message);this.status=status;this.code=code;this.details=details}
}
export const badParam=(message,details)=>new AppError(400,'INVALID_PARAM',message,details);
export const notFound=(message='Route not found')=>new AppError(404,'NOT_FOUND',message);
export const methodNotAllowed=(allow)=>Object.assign(new AppError(405,'METHOD_NOT_ALLOWED','This route does not support that method.',{allow}),{headers:{Allow:allow.join(', ')}});
export const tooMany=(retryAfterSeconds)=>Object.assign(new AppError(429,'RATE_LIMITED','Too many requests. Please slow down.',{retryAfterSeconds}),{headers:{'Retry-After':String(retryAfterSeconds)}});
export const internal=()=>new AppError(500,'INTERNAL','Something went wrong on our side.');
export const toBody=e=>({error:{code:e.code,message:e.message,details:e.details||{}}});
