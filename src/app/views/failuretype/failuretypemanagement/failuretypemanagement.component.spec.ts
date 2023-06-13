import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FailuretypemanagementComponent } from './failuretypemanagement.component';

describe('FailuretypemanagementComponent', () => {
  let component: FailuretypemanagementComponent;
  let fixture: ComponentFixture<FailuretypemanagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FailuretypemanagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FailuretypemanagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
