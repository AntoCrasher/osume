import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { CommonModule, DatePipe } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTabsModule } from '@angular/material/tabs';
import { MatStepperModule } from '@angular/material/stepper';
import { MatInputModule} from '@angular/material/input';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatListModule } from '@angular/material/list'
import { MatToolbarModule } from '@angular/material/toolbar'
import { BaseChartDirective  } from 'ng2-charts';


import { MappackClearComponent } from './mappack-clear/mappack-clear.component';
import { MappackManualClearComponent } from './mappack-manual-clear/mappack-manual-clear.component';
import { MappackAutoClearComponent } from './mappack-auto-clear/mappack-auto-clear.component';
import { HttpClient, provideHttpClient } from '@angular/common/http';
import { DbParserComponent } from './db-parser/db-parser.component';
import { PpGraphComponent } from './pp-graph/pp-graph.component';
import { AccountComponent } from './account/account.component';

@NgModule({
  declarations: [
    AppComponent,
    MappackClearComponent,
    MappackManualClearComponent,
    MappackAutoClearComponent,
    DbParserComponent,
    PpGraphComponent,
    AccountComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTabsModule,
    MatStepperModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDatepickerModule,
    MatIconModule,
    MatProgressBarModule,
    MatListModule,
    BaseChartDirective,
    MatToolbarModule
  ],
  providers: [
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    provideHttpClient(),
    { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },
    DatePipe,
    HttpClient
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
