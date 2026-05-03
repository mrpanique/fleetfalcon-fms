import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService, AuthUser } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch current user and update signal', (done) => {
    const mockUser: AuthUser = {
      id: 1,
      email: 'test@example.com',
      role: 'EMPLOYEE',
      employeeId: 'EMP-001'
    };

    service.fetchCurrentUser().subscribe(() => {
      expect(service.currentUser()).toEqual(mockUser);
      expect(service.isAuthenticated()).toBe(true);
      expect(service.isAdmin()).toBe(false);
      done();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/auth/me');
    expect(req.request.method).toBe('GET');
    req.flush(mockUser);
  });

  it('should set isAdmin to true when user role is ADMIN', (done) => {
    const adminUser: AuthUser = {
      id: 2,
      email: 'admin@example.com',
      role: 'ADMIN',
      employeeId: 'EMP-002'
    };

    service.fetchCurrentUser().subscribe(() => {
      expect(service.isAdmin()).toBe(true);
      done();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/auth/me');
    req.flush(adminUser);
  });

  it('should handle fetch current user error', (done) => {
    service.fetchCurrentUser().subscribe(
      () => fail('should have failed with 401 error'),
      () => {
        expect(service.currentUser()).toBeNull();
        expect(service.isAuthenticated()).toBe(false);
        done();
      }
    );

    const req = httpMock.expectOne('http://localhost:8080/api/auth/me');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });
  });

  it('should login with email and password', (done) => {
    const credentials = { email: 'test@example.com', password: 'TestPassword123' };

    service.login(credentials).subscribe(() => {
      done();
    });

    const req = httpMock.expectOne('http://localhost:8080/api/auth/login');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toContain('email=test%40example.com');
    expect(req.request.body).toContain('password=TestPassword123');
    req.flush({});
  });
});
