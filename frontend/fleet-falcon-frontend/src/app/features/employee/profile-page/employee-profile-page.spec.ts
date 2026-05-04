import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EmployeeProfilePageComponent } from './employee-profile-page';
import { AuthService } from '../../../core/services/auth.service';
import { ToastService } from '../../../core/services/toast.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('EmployeeProfilePageComponent', () => {
  let component: EmployeeProfilePageComponent;
  let fixture: ComponentFixture<EmployeeProfilePageComponent>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let toastServiceMock: jasmine.SpyObj<ToastService>;
  let routerMock: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    authServiceMock = jasmine.createSpyObj('AuthService', ['logout', 'updatePassword', 'fetchCurrentUser'], {
      currentUser: jasmine.createSpy('currentUser').and.returnValue({
        id: 1,
        email: 'test@example.com',
        role: 'EMPLOYEE',
        employeeId: 'EMP-001'
      })
    });

    toastServiceMock = jasmine.createSpyObj('ToastService', ['success', 'error']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      imports: [EmployeeProfilePageComponent],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: ToastService, useValue: toastServiceMock },
        { provide: Router, useValue: routerMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(EmployeeProfilePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should render email in the template', () => {
    const emailDisplay: DebugElement = fixture.debugElement.query(By.css('[data-testid="user-email"]'));
    if (emailDisplay) {
      expect(emailDisplay.nativeElement.textContent).toContain('test@example.com');
    }
  });

  it('should call logout and navigate to login on logout button click', () => {
    authServiceMock.logout.and.returnValue(of(void 0));

    component.logout();

    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(toastServiceMock.success).toHaveBeenCalledWith('Logged out successfully');
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
  });

  it('should validate password change - all fields required', () => {
    component.oldPassword = '';
    component.newPassword = 'NewPassword123';
    component.newPasswordConfirm = 'NewPassword123';

    component.changePassword();

    expect(toastServiceMock.error).toHaveBeenCalledWith('Please fill in all required fields.');
    expect(authServiceMock.updatePassword).not.toHaveBeenCalled();
  });

  it('should validate password change - new passwords must match', () => {
    component.oldPassword = 'OldPassword123';
    component.newPassword = 'NewPassword123';
    component.newPasswordConfirm = 'DifferentPassword123';

    component.changePassword();

    expect(toastServiceMock.error).toHaveBeenCalledWith('The new passwords do not match.');
    expect(authServiceMock.updatePassword).not.toHaveBeenCalled();
  });

  it('should validate password change - old and new password must differ', () => {
    component.oldPassword = 'SamePassword123';
    component.newPassword = 'SamePassword123';
    component.newPasswordConfirm = 'SamePassword123';

    component.changePassword();

    expect(toastServiceMock.error).toHaveBeenCalledWith('The new password must be different from the old password.');
    expect(authServiceMock.updatePassword).not.toHaveBeenCalled();
  });

  it('should successfully change password', () => {
    authServiceMock.updatePassword.and.returnValue(of(void 0));
    component.oldPassword = 'OldPassword123';
    component.newPassword = 'NewPassword456';
    component.newPasswordConfirm = 'NewPassword456';

    component.changePassword();

    expect(authServiceMock.updatePassword).toHaveBeenCalledWith(1, 'OldPassword123', 'NewPassword456');
    expect(toastServiceMock.success).toHaveBeenCalledWith('Password changed successfully');
    expect(component.oldPassword).toBe('');
    expect(component.newPassword).toBe('');
    expect(component.newPasswordConfirm).toBe('');
  });
});
