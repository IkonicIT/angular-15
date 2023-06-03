import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManagelocationsComponent } from './managelocations.component';

describe('ManagelocationsComponent', () => {
  let component: ManagelocationsComponent;
  let fixture: ComponentFixture<ManagelocationsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManagelocationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManagelocationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
