import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserManagementComponent } from './user-management/user-management.component';
import { AddUserComponent } from './add-user/add-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { UserSecurityRoleComponent } from './user-security-role/user-security-role.component';
import { UserTypesComponent } from './user-types/user-types.component';
import { AddUserTypeComponent } from './add-user-type/add-user-type.component';
import { EditUserTypeComponent } from './edit-user-type/edit-user-type.component';
import { UserAttributesComponent } from './user-attributes/user-attributes.component';
import { ViewUserComponent } from './view-user/view-user.component';
import { UserLogManagementComponent } from './userlog/user-log-management/user-log-management.component';
import { ViewuserLogComponent } from './userlog/viewuser-log/viewuser-log.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'User',
    },
    children: [
      {
        path: '',
        redirectTo: 'list',
        pathMatch: 'full',
      },
      {
        path: 'list',
        component: UserManagementComponent,
        data: {
          title: 'list',
        },
      },
      {
        path: 'log',
        component: UserLogManagementComponent,
        data: {
          title: 'log',
        },
      },
      {
        path: 'viewuserlog/:userName',
        component: ViewuserLogComponent,
        data: {
          title: 'viewuserlog',
        },
      },

      {
        path: 'addUser',
        component: AddUserComponent,
        data: {
          title: 'Add User',
        },
      },
      {
        path: 'editUser/:userId/:profileId',
        component: EditUserComponent,
        data: {
          title: 'Edit User',
        },
      },
      {
        path: 'viewUser/:userId/:profileId',
        component: ViewUserComponent,
        data: {
          title: 'View User',
        },
      },
      {
        path: 'securityRoles/:userId/:profileId',
        component: UserSecurityRoleComponent,
        data: {
          title: 'Security Roles',
        },
      },
      {
        path: 'types',
        component: UserTypesComponent,
        data: {
          title: 'User Types',
        },
      },
      {
        path: 'addUserType',
        component: AddUserTypeComponent,
        data: {
          title: 'Add User Type',
        },
      },
      {
        path: 'editUserType/:id/:cmpId',
        component: EditUserTypeComponent,
        data: {
          title: 'edit User Type',
        },
      },
      {
        path: 'attributes/:id/:cmpId',
        component: UserAttributesComponent,
        data: {
          title: 'User Attributes',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
