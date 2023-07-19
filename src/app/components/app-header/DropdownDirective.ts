/* import { Directive, HostListener, ElementRef, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appDropdown]',
})
export class DropdownDirective {
  private isShown: boolean = false;

  @HostListener('click') toggleOpen() {
    if (this.isShown) {
      this.renderer.removeClass(this.elRef.nativeElement, 'show');
      this.renderer.removeClass(this.elRef.nativeElement, 'd-block');
    } else {
      this.renderer.addClass(this.elRef.nativeElement, 'show');
      this.renderer.addClass(this.elRef.nativeElement, 'd-block');
    }
    this.isShown = !this.isShown;
  }

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}
} */
