import { ChangeDetectionStrategy, Component, inject, input, output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateStudentRequest } from '../../models/student';

@Component({
  selector: 'app-student-form',
  imports: [ReactiveFormsModule],
  templateUrl: './student-form.html',
  styleUrl: './student-form.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentForm {
  readonly saving = input(false);
  readonly submitted = output<CreateStudentRequest>();
  readonly cancelled = output<void>();
  private readonly fb = inject(FormBuilder);
  readonly form = this.fb.nonNullable.group({
    firstName: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(80)]],
    lastName: ['', [Validators.required, Validators.pattern(/\S/), Validators.maxLength(80)]],
    email: ['', [Validators.required, Validators.email, Validators.maxLength(254)]],
  });

  submit() {
    if (this.saving()) return;
    const value = this.form.getRawValue();
    this.form.setValue({
      firstName: value.firstName.trim(),
      lastName: value.lastName.trim(),
      email: value.email.trim().toLowerCase(),
    });
    this.form.markAllAsTouched();
    if (this.form.valid) this.submitted.emit(this.form.getRawValue());
  }
}
