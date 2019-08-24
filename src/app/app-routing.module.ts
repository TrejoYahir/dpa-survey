import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {StepGuard} from './guards/step.guard';
import {FinishGuard} from './guards/finish.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'first-step', loadChildren: './home/first-step/first-step.module#FirstStepPageModule' },
  { path: 'second-step', loadChildren: './home/second-step/second-step.module#SecondStepPageModule', canActivate: [StepGuard] },
  { path: 'thank-you', loadChildren: './home/thank-you/thank-you.module#ThankYouPageModule', canActivate: [FinishGuard] },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
