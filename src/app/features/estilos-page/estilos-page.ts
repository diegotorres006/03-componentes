import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SignalBoxComponent } from '../components/signal-box-component/signal-box-component';

@Component({
  selector: 'app-estilos-page',
  standalone: true,
  imports: [SignalBoxComponent], 
  templateUrl: './estilos-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstilosPage {}