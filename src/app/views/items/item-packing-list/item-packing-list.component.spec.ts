import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemPackingListComponent } from './item-packing-list.component';

describe('ItemPackingListComponent', () => {
  let component: ItemPackingListComponent;
  let fixture: ComponentFixture<ItemPackingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemPackingListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemPackingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
