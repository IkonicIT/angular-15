import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  LocationStrategy,
  HashLocationStrategy,
  CommonModule,
} from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { StorageServiceModule } from 'ngx-webstorage-service';
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
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgxSortableModule } from 'ngx-sortable'
import { provideUserIdleConfig } from 'angular-user-idle';
import { NgxSpinnerModule } from 'ngx-spinner';
import { NgPipesModule, OrderByPipe } from 'ngx-pipes';
import { NgxPasswordToggleModule } from 'ngx-password-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppCustomPreloader } from './app.custome.preloader';
import { AuthInterceptor } from 'src/AuthInterceptor';
import { ItemServiceManagementService } from './services/Items/item-service-management.service';
import { UserManagementService } from './services/user-management.service';
import { UserTypesService } from './services/user-types.service';
import { ReportsService } from './services/reports.service';
import { DatePipe } from '@angular/common';
import {
  WarrantyManagementService,
  CompanyManagementService,
  CompanyDocumentsService,
  CompanyStatusesService,
  CompanynotesService,
  CompanyTypesService,
  CompanyAttributesServiceService,
  LocationAttachmentsService,
  LocationManagementService,
  LocationAttributeService,
  LocationNotesService,
  LocationStatusService,
  LocationTypesService,
  ItemRepairItemsService,
  ItemAttachmentsService,
  ItemManagementService,
  ItemStatusService,
  ItemNotesService,
  ItemTypesService,
  LoginService,
} from './services';
import { ItemAttributeService } from './services/Items/item-attribute.service';
import { ForgotPasswordService } from './services/forgot-password.service';
import { UserAttributesService } from "./services/user-attributes.service";
import { ResetPasswordService } from './services/reset-password.service';
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
//import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
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
    StorageServiceModule,
    HttpClientModule,
    PagesModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
    NgPipesModule,
    DropdownTreeviewModule,
    NgxSortableModule,
    NgxSpinnerModule,
    // NgxPasswordToggleModule,
    //NgbDropdownModule,
    BrowserAnimationsModule,
    SelectDropDownModule,
    //DpDatePickerModule,
    MatButtonModule,
    MatRadioModule,
    TabsModule.forRoot(),
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    TooltipModule.forRoot(),
    TreeviewModule.forRoot(),
    TypeaheadModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ],
  exports: [CommonModule, FormsModule, ReactiveFormsModule],
  providers: [
    provideUserIdleConfig({ idle: 600, timeout: 300, ping: 120 }),
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
    ForgotPasswordService,
    ResetPasswordService,
    WarrantyManagementService,
    UserManagementService,
    UserAttributesService,
    UserTypesService,
    CompanyManagementService,
    CompanyDocumentsService,
    CompanyStatusesService,
    CompanynotesService,
    CompanyTypesService,
    CompanyAttributesServiceService,
    LocationAttachmentsService,
    LocationManagementService,
    LocationAttributeService,
    LocationNotesService,
    LocationStatusService,
    LocationTypesService,
    ItemServiceManagementService,
    ItemManagementService,
    ItemAttributeService,
    BroadcasterService,
    DashboardService,
    ReportsService,
    DatePipe,
    ItemRepairItemsService,
    ItemAttachmentsService,
    ItemStatusService,
    ItemTypesService,
    ItemNotesService,
    ExcelService,
    OrderByPipe,
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
