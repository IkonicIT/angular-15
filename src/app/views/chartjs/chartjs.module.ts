import { NgModule } from '@angular/core';
import { NgChartsModule } from 'ng2-charts';

import { ChartJSComponent } from './chartjs.component';
import { ChartJSRoutingModule } from './chartjs-routing.module';

@NgModule({
  imports: [
    ChartJSRoutingModule,
    NgChartsModule
  ],
  declarations: [ ChartJSComponent ]
})
export class ChartJSModule { }
