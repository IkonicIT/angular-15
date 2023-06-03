import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemRepairAttachmentsComponent } from './item-repair-attachments.component';

describe('ItemRepairAttachmentsComponent', () => {
  let component: ItemRepairAttachmentsComponent;
  let fixture: ComponentFixture<ItemRepairAttachmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemRepairAttachmentsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemRepairAttachmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
