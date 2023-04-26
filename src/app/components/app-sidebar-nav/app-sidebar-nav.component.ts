import { Component, ElementRef, Input, OnInit, Renderer2, HostBinding } from '@angular/core';
import { BroadcasterService } from '../../services/broadcaster.service';

// Import navigation elements
import { navigation } from '../../_nav';

@Component({
  selector: 'app-sidebar-nav',
  template: `
    <nav class="sidebar-nav">
    <ul class="nav">
    <ng-template ngFor let-navitem [ngForOf]="navigation">
        <li *ngIf="!isHasChild(navitem)"
            [ngClass]="{'nav-title': isTitle(navitem), 'nav-item': !(isTitle(navitem) || 
            isDivider(navitem)), 'nav-divider': isDivider(navitem)}"
        >
            <span *ngIf="isTitle(navitem)">{{navitem.name}}</span>
            <span *ngIf="isDivider(navitem)"></span>
            <a class="nav-link" *ngIf="!(isTitle(navitem) || isDivider(navitem))" routerLink="{{navitem.url}}"
               routerLinkActive="active">
                <i class="nav-icon" [ngClass]="navitem.icon"></i> {{navitem.name}}
            </a>
        </li>
        <li *ngIf="isHasChild(navitem)" appNavDropdown routerLinkActive="open" class="nav-item nav-dropdown open">
            <a appNavDropdownToggle class="nav-link nav-dropdown-toggle" role="button">
            <i class="nav-icon" [ngClass]="navitem.icon"></i> {{navitem.name}}</a>
            <ul class="nav-dropdown-items">
                <li class="nav-item" *ngFor="let cnavitem of navitem.children">
                    <a class="nav-link" *ngIf="!(isTitle(cnavitem) || isDivider(cnavitem))" routerLink="{{cnavitem.url}}"
                       routerLinkActive="active">
                        <i class="nav-icon" [ngClass]="cnavitem.icon"></i> {{cnavitem.name}}
                    </a>
                </li>
            </ul>
        </li>
    </ng-template>
</ul>
    </nav>`
})

export class AppSidebarNavComponent {
  @HostBinding('class.sidebar-nav') true: any;
  @HostBinding('attr.role') role: any;

  ngOnInit() {

    this.broadcasterService.on('refreshNavBar').subscribe(data => {

      if (this.broadcasterService.currentCompany == 'selectcompany') {
        this.navigation = [];
      }
      else if (parseInt(sessionStorage.getItem("highestRank") as any) == 1 && this.broadcasterService.currentCompany == 'nonselectcompany') {

        this.navigation = [
          {
            name: 'Dashboard',
            url: '/dashboard',
            icon: 'icon-speedometer'
          },

          {
            name: 'Company',
            url: '',
            icon: 'fa fa-building',
            children: [

              {
                name: 'Company Documents',
                url: '/company/documents',
                icon: 'fa fa-file'
              },
            ]
          },

          {
            name: 'Items',
            url: '',
            icon: 'fa fa-sitemap',
            children: [
              {
                name: 'Manage Items',
                url: '/items/list',
                icon: 'fa fa-sitemap'
              },

            ]
          },

        ];
      } else if (parseInt(sessionStorage.getItem("highestRank") as any) == 2 && this.broadcasterService.currentCompany == 'nonselectcompany') {

        this.navigation = [
          {
            name: 'Dashboard',
            url: '/dashboard',
            icon: 'icon-speedometer'
          },

          {
            name: 'Company',
            url: '',
            icon: 'fa fa-building',
            children: [

              {
                name: 'Company Documents',
                url: '/company/documents',
                icon: 'fa fa-file'
              },
            ]
          },
          {
            name: 'Items',
            url: '',
            icon: 'fa fa-sitemap',
            children: [
              {
                name: 'Manage Items',
                url: '/items/list',
                icon: 'fa fa-sitemap'
              },

            ]
          },

        ];
      } else if (parseInt(sessionStorage.getItem("highestRank") as any) == 3 && this.broadcasterService.currentCompany == 'nonselectcompany') {

        this.navigation = [
          {
            name: 'Dashboard',
            url: '/dashboard',
            icon: 'icon-speedometer'
          },

          {
            name: 'Company',
            url: '',
            icon: 'fa fa-building',
            children: [

              {
                name: 'Company Documents',
                url: '/company/documents',
                icon: 'fa fa-file'
              },
            ]
          },


          {
            name: 'Items',
            url: '',
            icon: 'fa fa-sitemap',
            children: [
              {
                name: 'Manage Items',
                url: '/items/list',
                icon: 'fa fa-sitemap'
              },

            ]
          },

        ];
      } else if (parseInt(sessionStorage.getItem("highestRank") as any) == 4 && this.broadcasterService.currentCompany == 'nonselectcompany') {

        this.navigation = [
          {
            name: 'Dashboard',
            url: '/dashboard',
            icon: 'icon-speedometer'
          },

          {
            name: 'Company',
            url: '',
            icon: 'fa fa-building',
            children: [

              {
                name: 'Company Documents',
                url: '/company/documents',
                icon: 'fa fa-file'
              },
            ]
          },
          {
            name: 'Items',
            url: '',
            icon: 'fa fa-sitemap',
            children: [
              {
                name: 'Manage Items',
                url: '/items/list',
                icon: 'fa fa-sitemap'
              },

            ]
          },

        ];

      } else if (parseInt(sessionStorage.getItem("highestRank") as any) == 5 && this.broadcasterService.currentCompany == 'nonselectcompany') {

        this.navigation = [
          {
            name: 'Dashboard',
            url: '/dashboard',
            icon: 'icon-speedometer'
          },

          {
            name: 'Company',
            url: '',
            icon: 'fa fa-building',
            children: [

              {
                name: 'Company Documents',
                url: '/company/documents',
                icon: 'fa fa-file'
              },
            ]
          },
          {
            name: 'Locations',
            url: '',
            icon: 'fa fa-map-marker',
            children: [
              {
                name: 'Manage Locations',
                url: '/location/list',
                icon: 'fa fa-map-marker'
              },
              {
                name: 'Location Types',
                url: '/location/types',
                icon: 'fa fa-map-marker'
              },

            ]
          },
          {
            name: 'Items',
            url: '',
            icon: 'fa fa-sitemap',
            children: [
              {
                name: 'Manage Items',
                url: '/items/list',
                icon: 'fa fa-sitemap'
              },

            ]
          },

          {
            name: 'Users',
            url: '',
            icon: 'fa fa-users',
            children: [
              {
                name: 'User Management',
                url: '/user/list',
                icon: 'fa fa-users'
              },

            ]
          },

        ];
      } else if (parseInt(sessionStorage.getItem("highestRank") as any) == 6 && this.broadcasterService.currentCompany == 'nonselectcompany') {

        this.navigation = [
          {
            name: 'Dashboard',
            url: '/dashboard',
            icon: 'icon-speedometer'
          },

          {
            name: 'Company',
            url: '',
            icon: 'fa fa-building',
            children: [

              {
                name: 'Company Documents',
                url: '/company/documents',
                icon: 'fa fa-file'
              }
            ]
          },
          {
            name: 'Locations',
            url: '',
            icon: 'fa fa-map-marker',
            children: [
              {
                name: 'Manage Locations',
                url: '/location/list',
                icon: 'fa fa-map-marker'
              },
              {
                name: 'Location Types',
                url: '/location/types',
                icon: 'fa fa-map-marker'
              },
              {
                name: 'Location Status',
                url: '/location/status',
                icon: 'fa fa-map-marker'
              }
            ]
          },
          {
            name: 'Items',
            url: '',
            icon: 'fa fa-sitemap',
            children: [
              {
                name: 'Manage Items',
                url: '/items/list',
                icon: 'fa fa-sitemap'
              },
              {
                name: 'Item Types',
                url: '/items/types',
                icon: 'fa fa-sitemap'
              },
              {
                name: 'Item Status',
                url: '/items/status',
                icon: 'fa fa-sitemap'
              },
              {
                name: 'Item Repair Items',
                url: '/items/repairItems',
                icon: 'fa fa-sitemap'
              }
            ]
          },
          {
            name: 'Vendor',
            url: '/vendor/list',
            icon: 'fa fa-user-circle'
          },
          {
            name: 'Warranty',
            url: '/warranty/list',
            icon: 'fa fa-superpowers'
          },
          {
            name: 'Users',
            url: '',
            icon: 'fa fa-users',
            children: [
              {
                name: 'User Management',
                url: '/user/list',
                icon: 'fa fa-users'
              },
              {
                name: 'User Types',
                url: '/user/types',
                icon: 'fa fa-users'
              }
            ]
          },

          {
            name: 'User Profile',
            url: '/profile',
            icon: 'fa fa-user',
            children: [
              {
                name: 'My Profile',
                url: '/profile',
                icon: 'fa fa-user'
              },
              ]
          },
          {
            name: 'Primary Findings',
            url: '/failuretype',
            icon: 'fa fa-user'
          },

          {
            name: 'Help',
            url: '/help',
            icon: 'fa fa-question'
          },


        ];
      } else if (parseInt(sessionStorage.getItem("highestRank") as any) == 7 && this.broadcasterService.currentCompany == 'nonselectcompany') {

        this.navigation = [
          {
            name: 'Dashboard',
            url: '/dashboard',
            icon: 'icon-speedometer'
          },

          {
            name: 'Company',
            url: '',
            icon: 'fa fa-building',
            children: [
              {
                name: 'Manage Companies',
                url: '/company/list',
                icon: 'fa fa-building'
              },
              {
                name: 'Company Documents',
                url: '/company/documents',
                icon: 'fa fa-file'
              },
              {
                name: 'Company Types',
                url: '/company/types',
                icon: 'fa fa-building'
              },
              {
                name: 'Company Attributes',
                url: '/company/attributes/0/0',
                icon: 'fa fa-building'
              },
              {
                name: 'Company Status',
                url: '/company/statuses',
                icon: 'fa fa-building'
              }
            ]
          },
          {
            name: 'Locations',
            url: '',
            icon: 'fa fa-map-marker',
            children: [
              {
                name: 'Manage Locations',
                url: '/location/list',
                icon: 'fa fa-map-marker'
              },
              {
                name: 'Location Types',
                url: '/location/types',
                icon: 'fa fa-map-marker'
              },
              {
                name: 'Location Status',
                url: '/location/status',
                icon: 'fa fa-map-marker'
              }
            ]
          },
          {
            name: 'Items',
            url: '',
            icon: 'fa fa-sitemap',
            children: [
              {
                name: 'Manage Items',
                url: '/items/list',
                icon: 'fa fa-sitemap'
              },
              {
                name: 'Item Types',
                url: '/items/types',
                icon: 'fa fa-sitemap'
              },
              {
                name: 'Item Status',
                url: '/items/status',
                icon: 'fa fa-sitemap'
              },
              {
                name: 'Item Repair Items',
                url: '/items/repairItems',
                icon: 'fa fa-sitemap'
              }
            ]
          },
          // {
          //   name: 'Template',
          //   url: '/template',
          //   icon: 'fa fa-user-circle'
          // },
          {
            name: 'Vendor',
            url: '/vendor/list',
            icon: 'fa fa-user-circle'
          },
          {
            name: 'Warranty',
            url: '/warranty/list',
            icon: 'fa fa-superpowers'
          },
          {
            name: 'Users',
            url: '',
            icon: 'fa fa-users',
            children: [
              {
                name: 'User Management',
                url: '/user/list',
                icon: 'fa fa-users'
              },
              {
                name: 'User Types',
                url: '/user/types',
                icon: 'fa fa-users'
              }
            ]
          },

          {
            name: 'User Profile',
            url: '/profile',
            icon: 'fa fa-user',
            children: [
              {
                name: 'My Profile',
                url: '/profile',
                icon: 'fa fa-user'
              },
              // {
              //   name: 'Logout',
              //   url: '/logout',
              //   icon: 'icon-logout'
              // },

            ]
          },
          {
            name: 'Primary Findings',
            url: '/failuretype',
            icon: 'fa fa-user'
          },

          {
            name: 'Help',
            url: '/help',
            icon: 'fa fa-question'
          },

        ];
      } else if (parseInt(sessionStorage.getItem("highestRank") as any) == 8 && this.broadcasterService.currentCompany == 'nonselectcompany') {

        this.navigation = [
          {
            name: 'Dashboard',
            url: '/dashboard',
            icon: 'icon-speedometer'
          },
          {
            name: 'Company',
            url: '',
            icon: 'fa fa-building',
            children: [
              {
                name: 'Manage Companies',
                url: '/company/list',
                icon: 'fa fa-building'
              },
              {
                name: 'Company Documents',
                url: '/company/documents',
                icon: 'fa fa-file'
              },
              {
                name: 'Company Types',
                url: '/company/types',
                icon: 'fa fa-building'
              },
              {
                name: 'Company Attributes',
                url: '/company/attributes/0/0',
                icon: 'fa fa-building'
              },
              {
                name: 'Company Status',
                url: '/company/statuses',
                icon: 'fa fa-building'
              }
            ]
          },
          {
            name: 'Locations',
            url: '',
            icon: 'fa fa-map-marker',
            children: [
              {
                name: 'Manage Locations',
                url: '/location/list',
                icon: 'fa fa-map-marker'
              },
              {
                name: 'Location Types',
                url: '/location/types',
                icon: 'fa fa-map-marker'
              },
              {
                name: 'Location Status',
                url: '/location/status',
                icon: 'fa fa-map-marker'
              }
            ]
          },
          {
            name: 'Items',
            url: '',
            icon: 'fa fa-sitemap',
            children: [
              {
                name: 'Manage Items',
                url: '/items/list',
                icon: 'fa fa-sitemap'
              },
              {
                name: 'Item Types',
                url: '/items/types',
                icon: 'fa fa-sitemap'
              },
              {
                name: 'Item Status',
                url: '/items/status',
                icon: 'fa fa-sitemap'
              },
              {
                name: 'Item Repair Items',
                url: '/items/repairItems',
                icon: 'fa fa-sitemap'
              }
            ]
          },
          {
            name: 'Template',
            url: '/template',
            icon: 'fa fa-user-circle-o'
          },
          {
            name: 'Vendor',
            url: '/vendor/list',
            icon: 'fa fa-user-circle'
          },
          {
            name: 'Warranty',
            url: '/warranty/list',
            icon: 'fa fa-superpowers'
          },
          {
            name: 'Users',
            url: '',
            icon: 'fa fa-users',
            children: [
              {
                name: 'User Management',
                url: '/user/list',
                icon: 'fa fa-users'
              },
              {
                name: 'User Log',
                url: '/user/log',
                icon: 'fa fa-users'
              },
              {
                name: 'User Types',
                url: '/user/types',
                icon: 'fa fa-users'
              }
            ]
          },

          {
            name: 'User Profile',
            url: '/profile',
            icon: 'fa fa-user',
            children: [
              {
                name: 'My Profile',
                url: '/profile',
                icon: 'fa fa-user'
              },
              // {
              //   name: 'Logout',
              //   url: '/logout',
              //   icon: 'icon-logout'
              // },

            ]
          },
          {
            name: 'Primary Findings',
            url: '/failuretype',
            icon: 'fa fa-user'
          },
          {
            name: 'Reports',
            url: '',
            icon: 'fa fa-sitemap',
            children: [
              {
                name: 'Inservice Vs Spare',
                url: '/reports/inservicevsspare',
                icon: 'fa fa-sitemap'
              },
              {
                name: 'Service Reports',
                url: '/reports/servicereports',
                icon: 'fa fa-sitemap'
              },
              
            ]
          },
          {
            name: 'Help',
            url: '/help',
            icon: 'fa fa-question'
          },

        ];
      }

      else if (parseInt(sessionStorage.getItem("highestRank") as any) == 9 && this.broadcasterService.currentCompany == 'nonselectcompany') {

        this.navigation = [
          {
            name: 'Dashboard',
            url: '/dashboard',
            icon: 'icon-speedometer'
          },
          {
            name: 'Company',
            url: '',
            icon: 'fa fa-building',
            children: [
              {
                name: 'Manage Companies',
                url: '/company/list',
                icon: 'fa fa-building'
              },
              {
                name: 'Company Documents',
                url: '/company/documents',
                icon: 'fa fa-file'
              },
              {
                name: 'Company Types',
                url: '/company/types',
                icon: 'fa fa-building'
              },
              {
                name: 'Company Attributes',
                url: '/company/attributes/0/0',
                icon: 'fa fa-building'
              },
              {
                name: 'Company Status',
                url: '/company/statuses',
                icon: 'fa fa-building'
              }
            ]
          },
          {
            name: 'Locations',
            url: '',
            icon: 'fa fa-map-marker',
            children: [
              {
                name: 'Manage Locations',
                url: '/location/list',
                icon: 'fa fa-map-marker'
              },
              {
                name: 'Location Types',
                url: '/location/types',
                icon: 'fa fa-map-marker'
              },
              {
                name: 'Location Status',
                url: '/location/status',
                icon: 'fa fa-map-marker'
              }
            ]
          },
          {
            name: 'Items',
            url: '',
            icon: 'fa fa-sitemap',
            children: [
              {
                name: 'Manage Items',
                url: '/items/list',
                icon: 'fa fa-sitemap'
              },
              {
                name: 'Item Types',
                url: '/items/types',
                icon: 'fa fa-sitemap'
              },
              {
                name: 'Item Status',
                url: '/items/status',
                icon: 'fa fa-sitemap'
              },
              {
                name: 'Item Repair Items',
                url: '/items/repairItems',
                icon: 'fa fa-sitemap'
              }
            ]
          },
          {
            name: 'Template',
            url: '/template',
            icon: 'fa fa-user-circle-o'
          },
          {
            name: 'Vendor',
            url: '/vendor/list',
            icon: 'fa fa-user-circle'
          },
          {
            name: 'Warranty',
            url: '/warranty/list',
            icon: 'fa fa-superpowers'
          },
          {
            name: 'Users',
            url: '',
            icon: 'fa fa-users',
            children: [
              {
                name: 'User Management',
                url: '/user/list',
                icon: 'fa fa-users'
              },
              {
                name: 'User Log',
                url: '/user/log',
                icon: 'fa fa-users'
              },
              {
                name: 'User Types',
                url: '/user/types',
                icon: 'fa fa-users'
              }
            ]
          },

          {
            name: 'User Profile',
            url: '/profile',
            icon: 'fa fa-user',
            children: [
              {
                name: 'My Profile',
                url: '/profile',
                icon: 'fa fa-user'
              },
              // {
              //   name: 'Logout',
              //   url: '/logout',
              //   icon: 'icon-logout'
              // },

            ]
          },
          {
            name: 'Primary Findings',
            url: '/failuretype',
            icon: 'fa fa-user'
          },
          {
            name: 'Reports',
            url: '',
            icon: 'fa fa-sitemap',
            children: [
              {
                name: 'Inservice Vs Spare',
                url: '/reports/inservicevsspare',
                icon: 'fa fa-sitemap'
              },
              {
                name: 'Service Reports',
                url: '/reports/servicereports',
                icon: 'fa fa-sitemap'
              },
              
            ]
          },
          {
            name: 'Help',
            url: '/help',
            icon: 'fa fa-question'
          },

        ];
      }

      else {

        this.navigation = [];
      }
    });
  }
  
  public navigation: any = [];

  public isDivider(item: { divider: any; }) {
    return item.divider ? true : false
  }

  public isTitle(item: { title: any; }) {
    return item.title ? true : false
  }
  
  isHasChild(navItem: any) {
    return navItem.hasOwnProperty('children') && navItem.children.length > 0;
  }
  constructor(private broadcasterService: BroadcasterService) {

  }
}

import { Router } from '@angular/router';

@Component({
  selector: 'app-sidebar-nav-item',
  template: `
    <li *ngIf="!isDropdown(); else dropdown" [ngClass]="hasClass() ? 'nav-item ' + item.class : 'nav-item'">
      <app-sidebar-nav-link [link]='item'></app-sidebar-nav-link>
    </li>
    <ng-template #dropdown>
      <li [ngClass]="hasClass() ? 'nav-item nav-dropdown ' + item.class : 'nav-item nav-dropdown'"
          [class.open]="isActive()"
          routerLinkActive="open"
          appNavDropdown>
        <app-sidebar-nav-dropdown [link]='item'></app-sidebar-nav-dropdown>
      </li>
    </ng-template>
    `
})


export class AppSidebarNavItemComponent {
  @Input() item: any;

  public hasClass() {
    return this.item.class ? true : false
  }

  public isDropdown() {
    return this.item.children ? true : false
  }

  public thisUrl() {
    return this.item.url
  }

  public isActive() {
    return this.router.isActive(this.thisUrl(), true)
  }

  constructor(private router: Router) { }

}

@Component({
  selector: 'app-sidebar-nav-link',
  template: `
    <a *ngIf="!isExternalLink(); else external"
      [ngClass]="hasVariant() ? 'nav-link nav-link-' + link.variant : 'nav-link'"
      routerLinkActive="active"
      [routerLink]="[link.url]"
      (click)="hideMobile()">
      <i *ngIf="isIcon()" class="{{ link.icon }}"></i>
      {{ link.name }}
      <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
    </a>
    <ng-template #external>
      <a [ngClass]="hasVariant() ? 'nav-link nav-link-' + link.variant : 'nav-link'" href="{{link.url}}">
        <i *ngIf="isIcon()" class="{{ link.icon }}"></i>
        {{ link.name }}
        <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
      </a>
    </ng-template>
  `
})
export class AppSidebarNavLinkComponent {
  @Input() link: any;

  public hasVariant() {
    return this.link.variant ? true : false
  }

  public isBadge() {
    return this.link.badge ? true : false
  }

  public isExternalLink() {
    return this.link.url.substring(0, 4) === 'http' ? true : false
  }

  public isIcon() {
    return this.link.icon ? true : false
  }

  public hideMobile() {
    if (document.body.classList.contains('sidebar-mobile-show')) {
      document.body.classList.toggle('sidebar-mobile-show')
    }
  }

  constructor() { }
}

@Component({
  selector: 'app-sidebar-nav-dropdown',
  template: `
    <a class="nav-link nav-dropdown-toggle" appNavDropdownToggle>
      <i *ngIf="isIcon()" class="{{ link.icon }}"></i>
      {{ link.name }}
      <span *ngIf="isBadge()" [ngClass]="'badge badge-' + link.badge.variant">{{ link.badge.text }}</span>
    </a>
    <ul class="nav-dropdown-items">
      <ng-template ngFor let-child [ngForOf]="link.children">
        <app-sidebar-nav-item item='child'></app-sidebar-nav-item>
      </ng-template>
    </ul>
  `
})
export class AppSidebarNavDropdownComponent {
  @Input() link: any;

  public isBadge() {
    return this.link.badge ? true : false
  }

  public isIcon() {
    return this.link.icon ? true : false
  }

  constructor() { }
}

@Component({
  selector: 'app-sidebar-nav-title',
  template: ''
})
export class AppSidebarNavTitleComponent implements OnInit {
  @Input() title: any;

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    const nativeElement: HTMLElement = this.el.nativeElement;
    const li = this.renderer.createElement('li');
    const name = this.renderer.createText(this.title.name);

    this.renderer.addClass(li, 'nav-title');

    if (this.title.class) {
      const classes = this.title.class;
      this.renderer.addClass(li, classes);
    }

    if (this.title.wrapper) {
      const wrapper = this.renderer.createElement(this.title.wrapper.element);

      this.renderer.appendChild(wrapper, name);
      this.renderer.appendChild(li, wrapper);
    } else {
      this.renderer.appendChild(li, name);
    }
    this.renderer.appendChild(nativeElement, li)
  }
}

export const APP_SIDEBAR_NAV = [
  AppSidebarNavComponent,
  AppSidebarNavDropdownComponent,
  AppSidebarNavItemComponent,
  AppSidebarNavLinkComponent,
  AppSidebarNavTitleComponent
];
