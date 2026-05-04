import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ToastService, ToastVariant } from './toast.service';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService]
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should display success toast with default duration', fakeAsync(() => {
    service.success('Operation successful');

    expect(service.toast()).toBeTruthy();
    expect(service.toast()?.text).toBe('Operation successful');
    expect(service.toast()?.variant).toBe('success');

    tick(2800);
    expect(service.toast()).toBeNull();
  }));

  it('should display error toast with default duration', fakeAsync(() => {
    service.error('An error occurred');

    expect(service.toast()).toBeTruthy();
    expect(service.toast()?.text).toBe('An error occurred');
    expect(service.toast()?.variant).toBe('error');

    tick(3200);
    expect(service.toast()).toBeNull();
  }));

  it('should dismiss toast immediately', fakeAsync(() => {
    service.success('Test message', 5000);
    expect(service.toast()).toBeTruthy();

    service.dismiss();
    expect(service.toast()).toBeNull();

    tick(5000);
    expect(service.toast()).toBeNull();
  }));

  it('should replace previous toast when new one is shown', fakeAsync(() => {
    service.success('First message');
    expect(service.toast()?.text).toBe('First message');

    service.error('Second message');
    expect(service.toast()?.text).toBe('Second message');
    expect(service.toast()?.variant).toBe('error');

    tick(3200);
    expect(service.toast()).toBeNull();
  }));
});
