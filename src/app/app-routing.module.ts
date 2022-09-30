import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AddBusinessPersonComponent } from './add-business-person/add-business-person.component';
import { AddStockinComponent } from './add-stockin/add-stockin.component';
import { AddStockoutComponent } from './add-stockout/add-stockout.component';
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  {path : '', component : LoginComponent},
  {path : 'AddBusinessPerson', component : AddBusinessPersonComponent},
  {path : 'AddStockin', component : AddStockinComponent},
  {path: 'AddStockOut',component:AddStockoutComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
