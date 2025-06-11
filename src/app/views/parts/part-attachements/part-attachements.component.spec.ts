import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PartAttachementsComponent } from './part-attachements.component';

describe('PartAttachementsComponent', () => {
  let component: PartAttachementsComponent;
  let fixture: ComponentFixture<PartAttachementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PartAttachementsComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PartAttachementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
