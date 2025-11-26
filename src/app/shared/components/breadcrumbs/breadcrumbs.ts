import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-breadcumbs',
  imports: [],
  templateUrl: './breadcrumbs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Breadcumbs {
    items = input<{ label: string; link?: string }[]>([]);
}