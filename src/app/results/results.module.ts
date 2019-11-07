import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ResultsPage } from './results.page';
import {NgxChartsModule} from '@swimlane/ngx-charts';

const routes: Routes = [
  {
    path: '',
    component: ResultsPage
  }
];

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        RouterModule.forChild(routes),
        NgxChartsModule
    ],
  declarations: [ResultsPage]
})
export class ResultsPageModule {}
