import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from '../material/material.module';
import { ReportsRoutingModule } from './reports-routing.module';
import { LocationTrackerComponent } from './location-tracker/location-tracker.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { GoogleMapsModule } from '@angular/google-maps';
import { BarChartComponent } from './app-bar-chart/app-bar.component';
import { InteractionComponent } from './interaction/pie.component';
import { GraphsComponent } from './graphs/graphs.component';
import { StackBarChart } from './app-stack-bar/app-stack-bar.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { TelecallerLcTableComponent } from './telecaller-lc-table/telecaller-lc-table.component';
import { GraphService } from './graphs/graphs.service';
import { CampaignReportContainerComponent } from './campaign-report-container/campaign-report-container.component';
import { TelecallerTalktimeComponent } from '../telecaller-talktime/telecaller-talktime.component';



@NgModule({
  imports: [
    GoogleMapsModule,
    ReportsRoutingModule,
    NgxMatSelectSearchModule,
    CommonModule,
    IonicModule, 
    FormsModule,
    ReactiveFormsModule,
    DemoMaterialModule
  ],
  declarations: [
    LocationTrackerComponent,
    BarChartComponent,
    InteractionComponent,
    StackBarChart,
    GraphsComponent,
    TelecallerTalktimeComponent,
    LineChartComponent,
    TelecallerLcTableComponent,
    CampaignReportContainerComponent
  ],
  providers: [GraphService]
})
export class ReportsModule { }
