import {loadRobots} from './loadRobots.js';
import {loadTranslations} from './translations.js';
import {createRepository} from '../domain/repository.js';
export function loadData(config,logger){
  const {valid,rejected}=loadRobots(config.robotsDir,config,logger);
  logger.info('data_loaded',{robots:valid.length,rejected:rejected.length});
  return{robots:createRepository(valid),translations:loadTranslations(config.i18nDir,logger),stats:{robots:valid.length,rejected:rejected.length}};
}
