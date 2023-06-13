import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserSecurityRoleComponent } from './user-security-role.component';

describe('UserSecurityRoleComponent', () => {
  let component: UserSecurityRoleComponent;
  let fixture: ComponentFixture<UserSecurityRoleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserSecurityRoleComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserSecurityRoleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
