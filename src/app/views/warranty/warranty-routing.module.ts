import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WarrantyTypeManagementComponent } from './warranty-type-management/warranty-type-management.component';
import { EditWarrantyTypeComponent } from './edit-warranty-type/edit-warranty-type.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Warranty Type',
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: WarrantyTypeManagementComponent,
        data: {
          title: 'list',
        },
      },
      {
        path: 'editwarrantytype/:warrantyId',
        component: EditWarrantyTypeComponent,
        data: {
          title: 'editwarrantytype',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WarrantyRoutingModule {}
