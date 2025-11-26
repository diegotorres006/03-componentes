import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SignalBoxComponent } from "../components/signal-box-component/signal-box-component";


@Component({
  selector: 'app-estilos-page',
  imports: [SignalBoxComponent],
  standalone: true,
  templateUrl: './estilos-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstilosPage { }