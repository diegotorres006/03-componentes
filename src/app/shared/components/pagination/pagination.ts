import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  // CORRECCIÓN CLAVE: Selector simplificado para evitar errores de coincidencia.
  selector: 'app-pagination',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './pagination.html',
  styleUrls: ['./pagination.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PaginationComponent {
  // Recibimos datos del padre (Página actual y Total)
  @Input() pages: number = 0;
  @Input() currentPage: number = 1;

  // CLAVE: Enviamos eventos al padre cuando se hace clic
  @Output() next = new EventEmitter<void>();
  @Output() prev = new EventEmitter<void>();

  // Cuando el usuario hace clic en "»" en el HTML
  onNext() {
    if (this.currentPage < this.pages) {
      this.next.emit(); // Avisamos al padre que cargue la siguiente.
    }
  }

  // Cuando el usuario hace clic en "«" en el HTML
  onPrev() {
    if (this.currentPage > 1) {
      this.prev.emit(); // Avisamos al padre que cargue la anterior.
    }
  }
}