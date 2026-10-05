import {
  ChangeDetectionStrategy,
  Component,
  computed,
  DestroyRef,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { finalize } from 'rxjs';
import { StudentApi } from '../../data-access/student-api';
import { CreateStudentRequest, Student } from '../../models/student';
import { StudentForm } from '../../components/student-form/student-form';
import { apiErrorMessage } from '../../../../core/http/api-error';

@Component({
  selector: 'app-student-directory',
  imports: [StudentForm],
  templateUrl: './student-directory.html',
  styleUrl: './student-directory.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StudentDirectory {
  private readonly api = inject(StudentApi);
  private readonly destroyRef = inject(DestroyRef);
  readonly createDialog = viewChild.required<ElementRef<HTMLDialogElement>>('createDialog');
  readonly detailDialog = viewChild.required<ElementRef<HTMLDialogElement>>('detailDialog');
  readonly students = signal<Student[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly detailLoading = signal(false);
  readonly query = signal('');
  readonly error = signal('');
  readonly formError = signal('');
  readonly detailError = signal('');
  readonly success = signal('');
  readonly selected = signal<Student | null>(null);
  readonly formVisible = signal(false);
  readonly hasLoaded = signal(false);
  readonly filteredStudents = computed(() => {
    const query = this.normalize(this.query());
    return this.students().filter((s) =>
      this.normalize(`${s.firstName} ${s.lastName} ${s.email} ${s.id}`).includes(query),
    );
  });

  constructor() {
    this.load();
  }

  load() {
    this.loading.set(true);
    this.error.set('');
    this.api
      .list()
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.loading.set(false)),
      )
      .subscribe({
        next: (students) => {
          this.students.set(students);
          this.hasLoaded.set(true);
        },
        error: (error) => this.error.set(apiErrorMessage(error)),
      });
  }

  openCreate() {
    this.formError.set('');
    this.success.set('');
    this.formVisible.set(true);
    this.createDialog().nativeElement.showModal();
  }

  closeCreate() {
    if (this.saving()) return;
    this.createDialog().nativeElement.close();
    this.formVisible.set(false);
  }

  cancelCreate(event: Event) {
    event.preventDefault();
    this.closeCreate();
  }

  create(request: CreateStudentRequest) {
    this.saving.set(true);
    this.formError.set('');
    this.api
      .create(request)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.saving.set(false)),
      )
      .subscribe({
        next: (student) => {
          this.createDialog().nativeElement.close();
          this.formVisible.set(false);
          this.query.set('');
          this.success.set(`${student.firstName} ${student.lastName} se registró correctamente.`);
          this.load();
        },
        error: (error) => this.formError.set(apiErrorMessage(error)),
      });
  }

  showDetails(id: string) {
    this.selected.set(null);
    this.detailError.set('');
    this.detailLoading.set(true);
    this.detailDialog().nativeElement.showModal();
    this.api
      .getById(id)
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        finalize(() => this.detailLoading.set(false)),
      )
      .subscribe({
        next: (student) => this.selected.set(student),
        error: (error) => this.detailError.set(apiErrorMessage(error)),
      });
  }

  initials(student: Student) {
    return `${student.firstName.charAt(0)}${student.lastName.charAt(0)}`.toUpperCase();
  }
  private normalize(value: string) {
    return value
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .trim();
  }
}
