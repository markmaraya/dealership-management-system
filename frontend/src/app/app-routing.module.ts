import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AvailableUnitsComponent } from './units/available-units/available-units.component';
import { SoldUnitsComponent } from './units/sold-units/sold-units.component';
import { SalesDetailsComponent } from './sales-details/sales-details.component';
import { AddUnitsComponent } from './units/add-units/add-units.component';
import { EditSalesComponent } from './edit-sales/edit-sales.component';
import { AddExpensesComponent } from './add-expenses/add-expenses.component';
import { EditExpensesComponent } from './edit-expenses/edit-expenses.component';

const routes: Routes = [
  {
    path: 'units/available-units',
    component: AvailableUnitsComponent,
    data: { title: 'Available Units' },
  },
  {
    path: 'units/sold-units',
    component: SoldUnitsComponent,
    data: { title: 'Sold Units' },
  },
  {
    path: 'sales-details/:id',
    component: SalesDetailsComponent,
    data: { title: 'Sales Details' },
  },
  {
    path: 'add-units',
    component: AddUnitsComponent,
    data: { title: 'Add Units' },
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
  { path: '', redirectTo: 'units/available-units', pathMatch: 'full' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
