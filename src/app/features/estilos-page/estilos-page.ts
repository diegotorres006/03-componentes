import { ChangeDetectionStrategy, Component } from '@angular/core';
import { SignalBoxComponent } from "../components/signal-box-component/signal-box-component";
import { Progressbar } from "../progressbar/progressbar";

@Component({
  selector: 'app-estilos-page',
  imports: [SignalBoxComponent, Progressbar],
  standalone: true,
  templateUrl: './estilos-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EstilosPage { }