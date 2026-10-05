export interface Student {
  readonly id: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly email: string;
}

export type CreateStudentRequest = Omit<Student, 'id'>;
