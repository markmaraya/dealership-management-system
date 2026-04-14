import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SalesComponent } from './sales/sales.component';
import { SalesDetailsComponent } from './sales-details/sales-details.component';
import { AddSalesComponent } from './add-sales/add-sales.component';
import { EditSalesComponent } from './edit-sales/edit-sales.component';
import { AddExpensesComponent } from './add-expenses/add-expenses.component';
import { EditExpensesComponent } from './edit-expenses/edit-expenses.component';

import { SoldUnitsComponent } from './units/sold-units/sold-units.component';

const routes: Routes = [
  {
    path: 'sales',
    component: SalesComponent,
    data: { title: 'List of Sales' },
  },
  {
    path: 'sales-details/:id',
    component: SalesDetailsComponent,
    data: { title: 'Sales Details' },
  },
  {
    path: 'add-sales',
    component: AddSalesComponent,
    data: { title: 'Add Sales' },
  },
  {
    path: 'edit-sales/:id',
    component: EditSalesComponent,
    data: { title: 'Edit Sales' },
  },
  {
    path: 'add-expenses/:id/:unitCode',
    component: AddExpensesComponent,
    data: { title: 'Add Expenses' },
  },
  {
    path: 'edit-expenses/:unitId/:id',
    component: EditExpensesComponent,
    data: { title: 'Edit Expenses' },
  },
  { path: 'units/sold-units', component: SoldUnitsComponent },
  { path: '', redirectTo: '/home', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
