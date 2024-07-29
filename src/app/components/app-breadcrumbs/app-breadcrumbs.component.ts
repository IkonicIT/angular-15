import { Component } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-breadcrumbs',
  template: ` <ng-template
    ngFor
    let-breadcrumb
    [ngForOf]="breadcrumbs"
    let-last=last
  >
    <li
      class="breadcrumb-item"
      *ngIf="
        (breadcrumb.label.title &&
          breadcrumb.url.substring(breadcrumb.url.length - 1) == '/') ||
        (breadcrumb.label.title && last)
      "
      [ngClass]="{active: last}"
    >
      <ng-container *ngIf="breadcrumb.url != '/'; else other">
        <a *ngIf="!last" [routerLink]="breadcrumb.url">{{
          breadcrumb.label.title
        }}</a>
        <span *ngIf="last" [routerLink]="breadcrumb.url">{{
          breadcrumb.label.title
        }}</span>
      </ng-container>
      <ng-template #other>
        <a href="/#/dashboard">{{ breadcrumb.label.title }}</a>
      </ng-template>
    </li>
  </ng-template>`,
})
export class AppBreadcrumbsComponent {
  breadcrumbs: any[];
  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.breadcrumbs = [];
        let currentRoute: any = this.route.root,
          url = '';
        do {
          const childrenRoutes = currentRoute.children;
          currentRoute = null;
          // tslint:disable-next-line:no-shadowed-variable
          childrenRoutes.forEach((route: any) => {
            if (route.outlet === 'primary') {
              const routeSnapshot = route.snapshot;
              url +=
                '/' +
                routeSnapshot.url.map((segment: any) => segment.path).join('/');
              this.breadcrumbs.push({
                label: route.snapshot.data,
                url: url,
              });
              currentRoute = route;
            }
          });
        } while (currentRoute);
      });
  }
}
