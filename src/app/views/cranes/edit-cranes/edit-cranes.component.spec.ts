import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditCranesComponent } from './edit-cranes.component';

describe('EditCranesComponent', () => {
  let component: EditCranesComponent;
  let fixture: ComponentFixture<EditCranesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EditCranesComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditCranesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
