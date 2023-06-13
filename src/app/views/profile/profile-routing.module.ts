import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MyProfileComponent } from './my-profile/my-profile.component';
import { ChangePasswordComponent } from './change-password/change-password.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Profile',
    },
    children: [
      {
        path: '',
        redirectTo: 'myProfile',
        pathMatch: 'full',
      },
      {
        path: 'myProfile',
        component: MyProfileComponent,
        data: {
          title: 'My Profile',
        },
      },
      {
        path: 'changePassword',
        component: ChangePasswordComponent,
        data: {
          title: 'Change Password',
        },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
