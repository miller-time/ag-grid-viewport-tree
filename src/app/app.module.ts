import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

// Imports for loading & configuring the in-memory web api
import { InMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './in-memory-data.service';

import { AgGridModule } from 'ag-grid-ng2/main';

import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    InMemoryWebApiModule.forRoot(InMemoryDataService),
    AgGridModule.withNg2ComponentSupport()
  ],
  declarations: [
    AppComponent,
    GridComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
