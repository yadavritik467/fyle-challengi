import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { InputTrimDirective } from './input-trim.directive';
import { Component, ElementRef } from '@angular/core';

@Component({
  template: `<input type="text" inputTrim />`,
})
class TestComponent {}

describe('InputTrimDirective', () => {
  let fixture: ComponentFixture<TestComponent>;
  let inputElement: HTMLInputElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, InputTrimDirective], // Import the standalone directive
      declarations: [TestComponent], // Declare the test component
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    inputElement = fixture.nativeElement.querySelector('input');
  });

  it('should create the directive', () => {
    const directive = new InputTrimDirective(new ElementRef(inputElement));
    expect(directive).toBeTruthy();
  });

  it('should replace multiple spaces with a single space on input', () => {
    fixture.detectChanges(); // Trigger change detection

    inputElement.value = '  Hello    World   ';
    inputElement.dispatchEvent(new Event('input')); // Dispatch input event

    fixture.whenStable().then(() => {
      fixture.detectChanges(); // Ensure the directive's effect is applied
      expect(inputElement.value).toBe(' Hello World ');
    });
  });

  it('should not modify value if there are no extra whitespaces', () => {
    fixture.detectChanges(); // Trigger change detection

    inputElement.value = 'Hello World';
    inputElement.dispatchEvent(new Event('input')); // Dispatch input event

    fixture.whenStable().then(() => {
      fixture.detectChanges(); // Ensure the directive's effect is applied
      expect(inputElement.value).toBe('Hello World');
    });
  });
});
