import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { DataTablesModule } from "angular-datatables";
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddBusinessPersonComponent } from './add-business-person/add-business-person.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BlockUIModule } from 'ng-block-ui';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AddStockinComponent } from './add-stockin/add-stockin.component';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DatePipe } from '@angular/common';
import { AddStockoutComponent } from './add-stockout/add-stockout.component';
import { LoginComponent } from './login/login.component';
@NgModule({
  declarations: [
    AppComponent,
    AddBusinessPersonComponent,
    AddStockinComponent,
    AddStockoutComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    DataTablesModule,
    BlockUIModule.forRoot(),
    NgbModule,
    BsDatepickerModule.forRoot(),
    BrowserAnimationsModule,
    FormsModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
