import { Component, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
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
  private route = inject(ActivatedRoute); // AGREGADO

  loginForm: FormGroup;
  formUtils = FormUtils;
  private returnUrl: string = '/home'; // AGREGADO: Valor por defecto

  // Signal para disparar la petición de login normal (Email/Pass)
  private loginTrigger = signal<{ email: string; password: string } | null>(null);

  // Recurso reactivo para el login normal
  loginResource = rxResource({
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

    // AGREGADO: Obtener returnUrl de los query params (Paso 1)
    // El error TS2571: Object is of type 'unknown' en this.route.snapshot
    // se resolverá con el fix de importación, pues ActivatedRoute tiene tipos definidos.
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';


    // Efecto para monitorear y redirigir tras login exitoso (Email/Pass)
    effect(() => {
      const result = this.loginResource.value();

      if (this.loginResource.isLoading()) console.log('⏳ Cargando login...');

      if (result) {
        console.log(`✅ Login exitoso. Navegando a ${this.returnUrl}...`);
        // USO DEL returnUrl EN LUGAR DE RUTA FIJA
        setTimeout(() => {
          this.router.navigateByUrl(this.returnUrl).then(success => {
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
        console.log(`🚀 Navegando a ${this.returnUrl}...`);
        // USO DEL returnUrl EN LUGAR DE RUTA FIJA
        setTimeout(() => {
          this.router.navigateByUrl(this.returnUrl);
        }, 50);
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