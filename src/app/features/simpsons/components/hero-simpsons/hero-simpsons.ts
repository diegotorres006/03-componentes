import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-hero-simpsons',
  imports: [],
  templateUrl: './hero-simpsons.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeroSimpsons {
  simpsonsCount = input.required<number>();
  totalPages = input.required<number>();
}