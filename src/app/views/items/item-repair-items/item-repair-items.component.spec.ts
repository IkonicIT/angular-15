import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemRepairItemsComponent } from './item-repair-items.component';

describe('ItemRepairItemsComponent', () => {
  let component: ItemRepairItemsComponent;
  let fixture: ComponentFixture<ItemRepairItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemRepairItemsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemRepairItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
