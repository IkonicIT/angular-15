import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import {
  LocationStrategy,
  HashLocationStrategy,
  CommonModule,
} from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { PagesModule } from './views/pages/pages.module';
import { ModalModule } from 'ngx-bootstrap/modal';
import { AlertModule } from 'ngx-bootstrap/alert';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AppComponent } from './app.component';
import { AppCustomPreloader } from './app.custome.preloader';
import { AuthInterceptor } from 'src/AuthInterceptor';
import { LoginService } from './services';
import { UserManagementService } from './services/user-management.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    CommonModule,
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    PagesModule,
    FormsModule,
    ReactiveFormsModule,
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    TooltipModule.forRoot(),
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
    UserManagementService
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  bootstrap: [AppComponent],
})
export class AppModule {}
