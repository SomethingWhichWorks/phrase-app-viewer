import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

/**
 * Phrase App components and services
 */
import { PhraseAppDashboardComponent } from './phrase-app/phrase-app-dashboard/phrase-app-dashboard.component';
import { MessageDetailsComponent } from './phrase-app/message-details/message-details.component';
import { PhraseAppListComponent } from './phrase-app/phrase-app-list/phrase-app-list.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: PhraseAppDashboardComponent
  },
  {
    path: 'phraseapplist',
    component: PhraseAppListComponent
  },
  {
    path: 'messageDetails/:key',
    component: MessageDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

export const routedComponents = [
  PhraseAppListComponent,
  PhraseAppDashboardComponent,
  MessageDetailsComponent
];
