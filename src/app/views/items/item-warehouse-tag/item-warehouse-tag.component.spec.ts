import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemWareHouseTagComponent } from './item-warehouse-tag.component';

describe('ItemNotesComponent', () => {
  let component: ItemWareHouseTagComponent;
  let fixture: ComponentFixture<ItemWareHouseTagComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemWareHouseTagComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemWareHouseTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
