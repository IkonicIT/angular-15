import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserLogManagementComponent } from './user-log-management.component';

describe('UserLogManagementComponent', () => {
  let component: UserLogManagementComponent;
  let fixture: ComponentFixture<UserLogManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserLogManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserLogManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
