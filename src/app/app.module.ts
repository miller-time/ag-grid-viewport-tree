import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AgGridModule } from 'ag-grid-ng2/main';

import { AppComponent } from './app.component';
import { GridComponent } from './grid/grid.component';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
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
