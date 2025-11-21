import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-signal-box',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './signal-box-components.html', 
  styleUrl: './signal-box-component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SignalBoxComponent {
  

  valor = signal<number>(0);

  cambiarValor(event: Event) {
    const input = event.target as HTMLInputElement;
    const nuevoValor = Number(input.value);
    this.valor.set(nuevoValor);
  }
  
  progreso = signal<number>(50);

  actualizarProgreso(event: Event) {
    const input = event.target as HTMLInputElement;
    const nuevoProgreso = Number(input.value);
    this.progreso.set(nuevoProgreso);
  }
}