import clonedeep from 'lodash.clonedeep';

import * as en_US from '../lang/en_US.json';
import * as es_ES from '../lang/es_ES.json';
import * as pt_BR from '../lang/pt_BR.json';
import * as ru_RU from '../lang/ru_RU.json';
import * as pl_PL from '../lang/pl_PL.json';

const languagePacks: object = {
  en_US,
  es_ES,
  pt_BR,
  ru_RU,
  pl_PL,
};

const availableLanguagePacks = Object.keys(languagePacks);

const loadLanguagePack = (langCode: string): any => {
  if (languagePacks[langCode]) {
    return clonedeep(languagePacks[langCode]);
  }
  return clonedeep(en_US);
};

export { loadLanguagePack, availableLanguagePacks };
