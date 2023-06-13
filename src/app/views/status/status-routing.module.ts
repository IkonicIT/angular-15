import { NgModule } from '@angular/core';
import {
    Routes,
    RouterModule
} from '@angular/router';
import { StatusManagementComponent } from "./status-management/status-management.component";
import { AddStatusComponent } from "./add-status/add-status.component";
import { EditStatusComponent } from "./edit-status/edit-status.component";


const routes: Routes = [
    {
        path: '',
        data: {
            title: 'Status'
        },
        children: [
            {
                path: '',
                redirectTo: 'list'
            },
            {
                path: 'list',
                component: StatusManagementComponent,
                data: {
                    title: 'list'
                }

            },
            {
                path: 'addStatus',
                component: AddStatusComponent,
                data: {
                    title: 'Add Status'
                }
            },
            {
                path: 'editStatus',
                component: EditStatusComponent,
                data: {
                    title: 'Edit Status'
                }
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class StatusRoutingModule { }