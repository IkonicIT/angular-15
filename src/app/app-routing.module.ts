import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppCustomPreloader } from './app.custome.preloader';
import { LoginComponent } from './views/pages/login.component';
import { DashboardModule } from './views/dashboard/dashboard.module';
import { PagesModule } from './views/pages/pages.module';
import { ButtonsModule } from './views/buttons/buttons.module';
import { ChartJSModule } from './views/chartjs/chartjs.module';
import { BaseModule } from './views/base/base.module';
import { CompanyModule } from './views/company/company.module';
import { LocationModule } from './views/location/location.module';
import { ItemsModule } from './views/items/items.module';
import { FullLayoutComponent, SimpleLayoutComponent } from './containers';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: '',
    component: FullLayoutComponent,
    data: {
      title: 'Home',
    },
    children: [
      {
        path: 'base',
        loadChildren: () =>
          import('./views/base/base.module').then((x) => BaseModule),
      },
      {
        path: 'buttons',
        loadChildren: () =>
          import('./views/buttons/buttons.module').then((x) => ButtonsModule),
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./views/chartjs/chartjs.module').then((x) => ChartJSModule),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then(
            (x) => DashboardModule
          ),
      },
      /* {
        path: 'icons',
        loadChildren: () => import('./views/icons/icons.module').then((x) => IconsModule),
      }, */
      {
        path: 'company',
        loadChildren: () =>
          import('./views/company/company.module').then((m) => m.CompanyModule),
        data: { preload: true },
      },
      /*  {
        path: 'notifications',
        loadChildren:
          () => import('./views/notifications/notifications.module').then((x) => NotificationsModule),
      }, */
      {
        path: 'items',
        loadChildren: () =>
          import('./views/items/items.module').then((x) => ItemsModule),
        data: { preload: true },
      },
      /*   {
        path: 'theme',
        loadChildren: () => import('./views/theme/theme.module').then((x) => ThemeModule),
      },
      {
        path: 'widgets',
        loadChildren: () => import('./views/widgets/widgets.module').then((x) => WidgetsModule),
      }, */
      {
        path: 'location',
        loadChildren: () =>
          import('./views/location/location.module').then(
            (x) => LocationModule
          ),
        data: { preload: true },
      },
      /* {
        path: 'template',
        loadChildren: () => import('./views/template/template.module').then((x) => TemplateModule),
      },
      {
        path: 'reports',
        loadChildren: () => import('./views/reports/reports.module').then((x) => ReportsModule),
      },
      {
        path: 'vendor',
        loadChildren: () => import('./views/vendor/vendor.module').then((x) => VendorModule),
      },
      {
        path: 'warranty',
        loadChildren: () => import('./views/warranty/warranty.module').then((x) => WarrantyModule),
      },
      {
        path: 'user',
        loadChildren: () => import('./views/user/user.module').then((x) => UserModule),
      },
      {
        path: 'profile',
        loadChildren: () => import('./views/profile/profile.module').then((x) => ProfileModule),
      },
      {
        path: 'failuretype',
        loadChildren:
          () => import('./views/failuretype/failure type.module').then((x) => FailureTypeModule),
      },
      {
        path: 'help',
        loadChildren: () => import('./views/help/help.module').then((x) => HelpModule),
      }, */
    ],
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login',
    },
  },
  {
    path: 'pages',
    component: SimpleLayoutComponent,
    data: {
      title: 'Pages',
    },
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./views/pages/pages.module').then((x) => PagesModule),
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: AppCustomPreloader }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
