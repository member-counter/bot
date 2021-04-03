import clonedeep from "lodash.clonedeep";
import getEnv from "./getEnv";
import LanguagePack from "../typings/LanguagePack";

import * as ca_ES from "../lang/ca_ES.json";
import * as cs_CZ from "../lang/cs_CZ.json";
import * as de_DE from "../lang/de_DE.json";
import * as en_US from "../lang/en_US.json";
import * as es_ES from "../lang/es_ES.json";
import * as fr_FR from "../lang/fr_FR.json";
import * as he_IL from "../lang/he_IL.json";
import * as hi_IN from "../lang/hi_IN.json";
import * as it_IT from "../lang/it_IT.json";
import * as pl_PL from "../lang/pl_PL.json";
import * as pt_BR from "../lang/pt_BR.json";
import * as ru_RU from "../lang/ru_RU.json";
import * as tr_TR from "../lang/tr_TR.json";

const { DISCORD_DEFAULT_LANG } = getEnv();

const languagePacks: object = {
	en_US,
	es_ES,
	pt_BR,
	ru_RU,
	pl_PL,
	de_DE,
	fr_FR,
	ca_ES,
	hi_IN,
	cs_CZ,
	it_IT,
	tr_TR,
	he_IL
};

const availableLanguagePacks = Object.keys(languagePacks);

const loadLanguagePack = (langCode: string): LanguagePack => {
	if (languagePacks[langCode]) {
		return clonedeep(languagePacks[langCode]);
	}
	return clonedeep(DISCORD_DEFAULT_LANG);
};

export { loadLanguagePack, availableLanguagePacks };
