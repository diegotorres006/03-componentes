import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../../core/services/firebase/auth'; 
import { ThemeSwitcher } from '../theme-switcher/theme-switcher'; 
import { ToastrService } from 'ngx-toastr'; // AGREGADO

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule, ThemeSwitcher],
  templateUrl: './navbar.html',
  styleUrl: './navbar.css'
})
export class NavbarComponent {
  private authService = inject(AuthService);
  private router = inject(Router);
  private toastr = inject(ToastrService);

  // Signal del usuario actual
  currentUser = this.authService.currentUser;
  loggingOut = signal(false); // Estado de carga del logout

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    return !!this.currentUser();
  }

  /**
   * Muestra el modal de confirmación de cierre de sesión
   */
  openLogoutModal() {
    const modal = document.getElementById('logout_modal') as HTMLDialogElement;
    modal?.showModal();
  }

  /**
   * Cierra la sesión tras la confirmación del modal
   */
  confirmLogout() {
    const modal = document.getElementById('logout_modal') as HTMLDialogElement;
    modal?.close();
    
    this.loggingOut.set(true); // Inicia el indicador de carga
    
    this.authService.logout().subscribe({
      next: () => {
        this.loggingOut.set(false);
        this.toastr.success('Sesión cerrada correctamente', 'Hasta pronto!');
        this.router.navigate(['/login']);
      },
      error: (error) => {
        this.loggingOut.set(false);
        console.error('Error al cerrar sesión:', error);
        this.toastr.error('No se pudo cerrar la sesión', 'Error');
      }
    });
  }

  /**
   * Inicia el proceso de logout abriendo el modal
   */
  logout() {
    this.openLogoutModal();
  }
}