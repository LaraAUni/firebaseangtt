import { Routes } from '@angular/router';
import { CharaSheet } from './chara-sheet/chara-sheet';
import { AbnoSheet } from './abno-sheet/abno-sheet';
import { Armoury } from './armoury/armoury';
import { Auth } from './auth/auth';
import { App } from './app';

export const routes: Routes = [
  {
    path: '',
    component: App,
    title: 'Third Trumpet', 
    children: [
       {
          path: 'characters',
          component: CharaSheet,
          title: 'Character Sheet',
          outlet: 'sheetOut'
        },
        {
          path: 'abnormalities',
          component: AbnoSheet,
          title: 'Abnormality Sheet',
          outlet: 'sheetOut'
        },
        {
          path: 'armoury',
          component: Armoury,
          title: 'Armoury',
          outlet: 'sheetOut'
        }
    ]
  },
  {
    path:'sign-in',
    component: Auth,
    title: 'Sign In'
  }
];
