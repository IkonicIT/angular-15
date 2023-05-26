import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  LocationStrategy,
  HashLocationStrategy,
  CommonModule,
} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './views/pages/pages.module';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
} from '@angular/forms';
import { SelectDropDownModule } from 'ngx-select-dropdown';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgPipesModule, OrderByPipe } from 'ngx-pipes';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppCustomPreloader } from './app.custome.preloader';
import { AuthInterceptor } from 'src/AuthInterceptor';
import { LoginService } from './services';
import { UserManagementService } from './services/user-management.service';
import {
  CompanyManagementService,
  CompanyDocumentsService,
  LocationManagementService,
  ItemManagementService,
  ItemTypesService,
} from './services';
import { BroadcasterService } from './services/broadcaster.service';
import { DashboardService } from './services/dashboard.service';
import { ExcelService } from './services/excel-service';
import { DropdownTreeviewModule } from './views/dropdown-treeview-select/dropdown-treeview.module';
import { TypeaheadModule } from 'ngx-bootstrap/typeahead';
import { NgChartsModule } from 'ng2-charts';
import { TreeviewModule } from 'ngx-treeview';
import {
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarFooterComponent,
  APP_SIDEBAR_NAV,
  AppSidebarMinimizerComponent,
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
} from './components';
import { FullLayoutComponent } from './containers/full-layout/full-layout.component';
import { SimpleLayoutComponent } from './containers/simple-layout/simple-layout.component';
import {
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES,
} from './directives';

const APP_DIRECTIVES = [
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES,
];

const APP_COMPONENTS = [
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarFooterComponent,
  APP_SIDEBAR_NAV,
  AppSidebarMinimizerComponent,
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
];

const APP_CONTAINERS = [FullLayoutComponent, SimpleLayoutComponent];

@NgModule({
  declarations: [
    AppComponent,
    ...APP_COMPONENTS,
    ...APP_CONTAINERS,
    ...APP_DIRECTIVES,
  ],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PagesModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    NgPipesModule,
    DropdownTreeviewModule,
    NgxSpinnerModule,
    BrowserAnimationsModule,
    SelectDropDownModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    TooltipModule.forRoot(),
    TreeviewModule.forRoot(),
    TypeaheadModule.forRoot(),
  ],
  exports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
    AppCustomPreloader,
    {
      provide: LocationStrategy,
      useClass: HashLocationStrategy,
    },
    LoginService,
    UserManagementService,
    CompanyManagementService,
    CompanyDocumentsService,
    LocationManagementService,
    ItemManagementService,
    BroadcasterService,
    DashboardService,
    ItemTypesService,
    ExcelService,
    OrderByPipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
