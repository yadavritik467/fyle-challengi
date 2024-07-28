import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[inputTrim]',
  standalone: true,
})
export class InputTrimDirective {
  constructor(private el: ElementRef<HTMLInputElement>) {}

  @HostListener('input', ['$event']) onInputChange(event: Event) {
    let input: string = this.el.nativeElement.value;
    const trimmedValue = input.replace(/\s+/g, ' ')
    this.el.nativeElement.value = trimmedValue;
  }
}
