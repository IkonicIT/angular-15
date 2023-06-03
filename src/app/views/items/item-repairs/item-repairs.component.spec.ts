import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemRepairsComponent } from './item-repairs.component';

describe('ItemRepairsComponent', () => {
  let component: ItemRepairsComponent;
  let fixture: ComponentFixture<ItemRepairsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemRepairsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemRepairsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
