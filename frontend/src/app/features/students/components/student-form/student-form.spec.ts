import { TestBed } from '@angular/core/testing';
import { StudentForm } from './student-form';

describe('StudentForm', () => {
  it('does not submit whitespace-only names', () => {
    const component = TestBed.createComponent(StudentForm).componentInstance;
    const listener = vi.fn();
    component.submitted.subscribe(listener);
    component.form.setValue({ firstName: '  ', lastName: 'Pérez', email: 'ana@example.com' });
    component.submit();
    expect(listener).not.toHaveBeenCalled();
    expect(component.form.invalid).toBe(true);
  });
  it('normalizes valid input before submitting', () => {
    const component = TestBed.createComponent(StudentForm).componentInstance;
    const listener = vi.fn();
    component.submitted.subscribe(listener);
    component.form.setValue({
      firstName: ' Ana ',
      lastName: ' Pérez ',
      email: ' ANA@EXAMPLE.COM ',
    });
    component.submit();
    expect(listener).toHaveBeenCalledWith({
      firstName: 'Ana',
      lastName: 'Pérez',
      email: 'ana@example.com',
    });
  });
});
