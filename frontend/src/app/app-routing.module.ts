import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AvailableUnitsComponent } from './units/available-units/available-units.component';
import { SoldUnitsComponent } from './units/sold-units/sold-units.component';
import { UnitDetailsComponent } from './unit-details/unit-details/unit-details.component';
import { AddUnitsComponent } from './unit-details/add-units/add-units.component';
import { EditUnitDetailsComponent } from './unit-details/edit-unit-details/edit-unit-details.component';
import { AddExpensesComponent } from './expenses/add-expenses/add-expenses.component';
import { EditExpensesComponent } from './expenses/edit-expenses/edit-expenses.component';

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
    path: 'unit-details/:id',
    component: UnitDetailsComponent,
    data: { title: 'Unit Details' },
  },
  {
    path: 'add-units',
    component: AddUnitsComponent,
    data: { title: 'Add Units' },
  },
  {
    path: 'edit-unit-details/:id',
    component: EditUnitDetailsComponent,
    data: { title: 'Edit Unit Details' },
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
