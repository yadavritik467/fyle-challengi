import { TestBed } from '@angular/core/testing';
import { UtilsService } from './utils.service';
import { ToastrService } from 'ngx-toastr';

class MockToastrService {
  success(message: string) {}
  error(message: string) {}
}

describe('UtilsService', () => {
  let service: UtilsService;
  let toastrService: ToastrService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UtilsService,
        { provide: ToastrService, useClass: MockToastrService },
      ],
    });

    service = TestBed.inject(UtilsService);
    toastrService = TestBed.inject(ToastrService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show success message', () => {
    const toastrSpy = spyOn(toastrService, 'success');
    const message = 'Success message';

    service.showSuccess(message);

    expect(toastrSpy).toHaveBeenCalledWith(message, '', { timeOut: 1500 });
  });

  it('should show error message', () => {
    const toastrSpy = spyOn(toastrService, 'error');
    const message = 'Error message';

    service.showError(message);

    expect(toastrSpy).toHaveBeenCalledWith(message, 'Error');
  });

  it('should transform string to camel case', () => {
    const result = service.camelCasePipe('hello world');
    expect(result).toBe('Hello World');
  });

  it('should return empty string if input is empty for camelCasePipe', () => {
    const result = service.camelCasePipe('');
    expect(result).toBe('');
  });
});
