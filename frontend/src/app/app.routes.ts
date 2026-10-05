import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'students' },
  {
    path: 'students',
    title: 'Estudiantes · Aula',
    loadComponent: () =>
      import('./features/students/pages/student-directory/student-directory').then(
        (m) => m.StudentDirectory,
      ),
  },
  { path: '**', redirectTo: 'students' },
];
