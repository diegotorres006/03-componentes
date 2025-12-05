import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { rxResource } from '@angular/core/rxjs-interop';
import { of } from 'rxjs';
import { AuthService } from '../../../../core/services/firebase/auth';
import { FormUtils } from '../../../../shared/utils/form-utils';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login-page.html',
  styleUrls: ['./login-page.css']
})
export class LoginPageComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm: FormGroup;
  formUtils = FormUtils;

  // Signal para disparar la petición de login normal (Email/Pass)
  private loginTrigger = signal<{ email: string; password: string } | null>(null);

  // Recurso reactivo para el login normal
  loginResource = rxResource({
    // CORRECCIÓN: Usamos 'params' y 'stream' en lugar de 'request' y 'loader'
    params: () => this.loginTrigger(),
    stream: ({ params }) => {
      if (!params) return of(null);
      return this.authService.login(params.email, params.password);
    }
  });

  // Computed signals
  loading = this.loginResource.isLoading;
  
  errorMessage = () => {
    const error = this.loginResource.error();
    if (!error) return '';

    const code = (error as any).code || '';
    const errorMessages: { [key: string]: string } = {
      'auth/invalid-email': 'El correo electrónico no es válido',
      'auth/user-disabled': 'El usuario ha sido deshabilitado',
      'auth/user-not-found': 'No existe un usuario con este correo',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/invalid-credential': 'Credenciales inválidas',
      'auth/popup-closed-by-user': 'Se cerró la ventana de inicio de sesión'
    };
    return errorMessages[code] || 'Error al iniciar sesión';
  };

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Efecto para monitorear y redirigir tras login exitoso (Email/Pass)
    effect(() => {
      const result = this.loginResource.value();
      
      // Logs para depuración
      if (this.loginResource.isLoading()) console.log('⏳ Cargando login...');
      
      if (result) {
        console.log('✅ Login (Email/Pass) exitoso detectado. Navegando a /simpsons...');
        // Pequeño timeout para asegurar que el router y el guard estén sincronizados
        setTimeout(() => {
          this.router.navigate(['/simpsons']).then(success => {
             if (!success) console.error('❌ La navegación fue bloqueada (posiblemente por el Guard)');
          });
        }, 100);
      }
    });
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }
    const { email, password } = this.loginForm.value;
    this.loginTrigger.set({ email, password });
  }

  // Método explícito para el botón de Google
  loginWithGoogle() {
    console.log('🔵 Iniciando login con Google...');
    this.authService.loginWithGoogle().subscribe({
      next: (user) => {
        console.log('✅ Google Login exitoso:', user);
        console.log('🚀 Navegando a /simpsons...');
        this.router.navigate(['/simpsons']);
      },
      error: (err) => {
        console.error('❌ Error en Google Login:', err);
      }
    });
  }

  // Getters para el template
  get email() { return this.loginForm.get('email'); }
  get password() { return this.loginForm.get('password'); }
}