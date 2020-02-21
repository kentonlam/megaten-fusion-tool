import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';

import { CompendiumRoutingModule } from '../p4/compendium-routing.module';
import { FusionDataService } from '../p4/fusion-data.service';

import { COMPENDIUM_CONFIG, FUSION_DATA_SERVICE, FUSION_TRIO_SERVICE } from '../compendium/constants';
import { P4CompendiumModule } from '../p4/p4-compendium.module';
import { CompendiumConfig } from '../p4/models';

import COMP_CONFIG_JSON from './data/comp-config.json';
import DEMON_DATA_JSON from './data/demon-data.json';

import FUSION_CHART_JSON from '../pq/data/fusion-chart.json';
import SKILL_DATA_JSON from './data/skill-data.json';
import SPECIAL_RECIPES_JSON from './data/special-recipes.json';

import INHERIT_TYPES_JSON from '../p5/data/inheritance-types.json';
import PARTY_DATA_JSON from './data/party-data.json';

function getEnumOrder(target: string[]): { [key: string]: number } {
  const result = {};
  for (let i = 0; i < target.length; i++) {
    result[target[i]] = i;
  }
  return result;
}

const skillElems = COMP_CONFIG_JSON.resistElems.concat(COMP_CONFIG_JSON.skillElems);
const inheritTypes: { [elem: string]: number[] } = {};
const races = [];

for(const race of COMP_CONFIG_JSON['races']) {
  races.push(race);
  races.push(race + ' P');
}

for (let i = 0; i < INHERIT_TYPES_JSON.inherits.length; i++) {
  inheritTypes[INHERIT_TYPES_JSON.inherits[i]] = INHERIT_TYPES_JSON.ratios[i].split('').map(x => x === 'O' ? 1 : 0);
}

for (const entry of Object.values(SKILL_DATA_JSON)) {
  entry['rank'] = entry.cost > 1000 ? entry.cost - 1000 : (entry.cost || 1);
}

export const P3_COMPENDIUM_CONFIG: CompendiumConfig = {
  appTitle: 'Persona 5 Scramble',
  gameTitles: { p5s: 'Persona 5 Scramble' },
  appCssClasses: ['p5'],

  races,
  raceOrder: getEnumOrder(races),
  baseStats: COMP_CONFIG_JSON.baseStats,
  skillElems,
  resistElems: COMP_CONFIG_JSON.resistElems,
  resistCodes: COMP_CONFIG_JSON.resistCodes,
  elemOrder: getEnumOrder(skillElems),
  inheritTypes,
  inheritElems: INHERIT_TYPES_JSON.elems,

  enemyStats: ['HP', 'MP'],
  enemyResists: COMP_CONFIG_JSON.resistElems.concat(['almighty']),

  demonData: { p5s: [DEMON_DATA_JSON, PARTY_DATA_JSON] },
  skillData: { p5s: [SKILL_DATA_JSON] },
  enemyData: { p5s: [] },

  normalTable: { p5s: FUSION_CHART_JSON },
  specialRecipes: { p5s: SPECIAL_RECIPES_JSON },
  hasSkillCards: { p5s: false }
};

@NgModule({
  imports: [
    CommonModule,
    P4CompendiumModule,
    CompendiumRoutingModule
  ],
  providers: [
    Title,
    FusionDataService,
    [{ provide: FUSION_DATA_SERVICE, useExisting: FusionDataService }],
    [{ provide: FUSION_TRIO_SERVICE, useExisting: FusionDataService }],
    [{ provide: COMPENDIUM_CONFIG, useValue: P3_COMPENDIUM_CONFIG }]
  ]
})
export class CompendiumModule { }