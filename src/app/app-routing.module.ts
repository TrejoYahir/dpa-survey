import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {StepGuard} from './guards/step.guard';
import {FinishGuard} from './guards/finish.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './home/home.module#HomePageModule'},
  { path: 'first-step', loadChildren: './home/first-step/first-step.module#FirstStepPageModule' },
  { path: 'second-step', loadChildren: './home/second-step/second-step.module#SecondStepPageModule', canActivate: [StepGuard] },
  { path: 'thank-you', loadChildren: './home/thank-you/thank-you.module#ThankYouPageModule', canActivate: [FinishGuard] },
  { path: 'terms', loadChildren: './terms/terms.module#TermsPageModule' },
  { path: 'results', loadChildren: './results/results.module#ResultsPageModule' },
  { path: 'results/detail/:id', loadChildren: './results/result-detail/result-detail.module#ResultDetailPageModule' },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
