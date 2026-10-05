import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { StudentApi } from './student-api';

describe('StudentApi', () => {
  let api: StudentApi;
  let http: HttpTestingController;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
    api = TestBed.inject(StudentApi);
    http = TestBed.inject(HttpTestingController);
  });
  afterEach(() => http.verify());
  it('lists students through the local proxy', () => {
    api.list().subscribe((students) => expect(students).toEqual([]));
    const request = http.expectOne('/api/students');
    expect(request.request.method).toBe('GET');
    request.flush([]);
  });
  it('sends the required JSON when creating a student', () => {
    const student = { firstName: 'Ana', lastName: 'Pérez', email: 'ana@example.com' };
    api.create(student).subscribe((result) => expect(result.id).toBe('student-id'));
    const request = http.expectOne('/api/students');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(student);
    request.flush({ id: 'student-id', ...student }, { status: 201, statusText: 'Created' });
  });
  it('queries an individual student instead of using the list cache', () => {
    api.getById('student-id').subscribe();
    const request = http.expectOne('/api/students/student-id');
    expect(request.request.method).toBe('GET');
    request.flush({ id: 'student-id' });
  });
});
