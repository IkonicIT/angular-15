import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemNoteAttachementsComponent } from './item-note-attachements.component';

describe('ItemNoteAttachementsComponent', () => {
  let component: ItemNoteAttachementsComponent;
  let fixture: ComponentFixture<ItemNoteAttachementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemNoteAttachementsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemNoteAttachementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
