import { Component, inject } from '@angular/core'; // Faltaba importar inject
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // Faltaba importar Router
import { ThemeSwitcher } from '../theme-switcher/theme-switcher';
import { AuthService } from '../../../core/services/firebase/auth'; // Corregida la comilla que faltaba

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

  // Signal del usuario actual
  currentUser = this.authService.currentUser;

  logout() {
    this.authService.logout().subscribe(() => {
      this.router.navigate(['/login']);
    });
  }
}