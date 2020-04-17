import clonedeep from 'lodash.clonedeep';

import * as en_US from '../lang/en_US.json';
import * as es_ES from '../lang/es_ES.json';
import * as pt_BR from '../lang/pt_BR.json';

const languagePacks: object = {
  en_US,
  es_ES,
  pt_BR,
};

export default (langCode: string) => {
  if (languagePacks[langCode]) {
    return clonedeep(languagePacks[langCode]);
  }
  return clonedeep(en_US);
};
