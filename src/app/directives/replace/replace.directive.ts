import { Directive, ElementRef, OnInit } from '@angular/core';

@Directive({
  selector:
    '[appHostReplace], app-aside, app-breadcrumbs, app-footer, app-header, app-sidebar, app-sidebar-footer, app-sidebar-form, app-sidebar-header, app-sidebar-minimizer, app-sidebar-nav, app-sidebar-nav-dropdown, app-sidebar-nav-item, app-sidebar-nav-link, app-sidebar-nav-title',
})
export class ReplaceDirective implements OnInit {
  constructor(private el: ElementRef) {}
  ngOnInit() {
    const nativeElement: HTMLElement = this.el.nativeElement;
    const parentElement: any = nativeElement.parentElement;
    while (nativeElement.firstChild) {
      parentElement.insertBefore(nativeElement.firstChild, nativeElement);
    }
    parentElement.removeChild(nativeElement);
  }
}
