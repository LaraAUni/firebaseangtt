import { Routes } from '@angular/router';
import { App } from './app';
import { NotFoundComponent } from './not-found-component/not-found-component';

export const routes: Routes = [
  {
    path: '',
    component: App,
    title: 'Third Trumpet',
  },
{ path: '**', component: NotFoundComponent}

];
