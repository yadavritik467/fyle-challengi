import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  constructor(private readonly toastr: ToastrService) {}

  showSuccess(message: string) {
    this.toastr.success(message, '', { timeOut: 1500 });
  }
  showError(message: string) {
    this.toastr.error(message, 'Error');
  }

  camelCasePipe(val: string): string {
    if (val) {
      val = val
        ?.trim()
        ?.split(' ')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    }
    return val;
  }
}
