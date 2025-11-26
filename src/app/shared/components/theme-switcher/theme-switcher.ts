import { TitleCasePipe } from '@angular/common';
import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-theme-switcher',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './Theme-Switcher.html',
})
export class ThemeSwitcher {
  // Temas disponibles
  themes = ['light', 'dark'];

  // Tema actual reactivo
  currentTheme = signal<string>(this.getCurrentTheme());

  // Obtiene el tema actual desde el atributo HTML
  private getCurrentTheme(): string {
    return document.documentElement.getAttribute('data-theme') ?? 'light';
  }

  // Cambia el tema y actualiza el atributo global
  setTheme(theme: string): void {
    document.documentElement.setAttribute('data-theme', theme);
    this.currentTheme.set(theme);
  }
}