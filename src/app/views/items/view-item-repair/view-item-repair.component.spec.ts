import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewItemRepairComponent } from './view-item-repair.component';

describe('ViewItemRepairComponent', () => {
  let component: ViewItemRepairComponent;
  let fixture: ComponentFixture<ViewItemRepairComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ViewItemRepairComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewItemRepairComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
