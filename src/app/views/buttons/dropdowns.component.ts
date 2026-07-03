import { Component } from '@angular/core';

@Component({
  selector: 'app-dropdowns',
  templateUrl: './dropdowns.component.html',
})
export class DropdownsComponent {
  // Dropdown items
  items: string[] = [
    'The first choice!',
    'Another choice for you.',
    'A third choice here!'
  ];

  // Dropdown state
  isOpen = false;

  constructor() {}

  // Open dropdown programmatically
  openDropdown(): void {
    this.isOpen = true;
  }

  // Close dropdown programmatically
  closeDropdown(): void {
    this.isOpen = false;
  }

  // Toggle dropdown manually
  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }
}
