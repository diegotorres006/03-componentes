import { FormGroup } from '@angular/forms';

export class FormUtils {
  static getFieldError(form: FormGroup, fieldName: string): string | null {
    const control = form.get(fieldName);
    if (!control || !control.errors || !control.touched) return null;

    const errors = control.errors;
    if (errors['required']) return 'Este campo es requerido';
    if (errors['email']) return 'Formato de correo inválido';
    if (errors['minlength']) return `Mínimo ${errors['minlength'].requiredLength} caracteres`;
    if (errors['passwordMismatch']) return 'Las contraseñas no coinciden';
    
    return 'Campo inválido';
  }
}