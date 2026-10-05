import { HttpErrorResponse } from '@angular/common/http';

export function apiErrorMessage(error: unknown): string {
  if (!(error instanceof HttpErrorResponse)) return 'Ocurrió un error. Inténtalo de nuevo.';
  if (error.status === 0)
    return 'No pudimos conectar con el servidor. Verifica que la API esté encendida.';
  if (typeof error.error?.detail === 'string') return error.error.detail;
  return 'No fue posible completar la solicitud. Inténtalo de nuevo.';
}
