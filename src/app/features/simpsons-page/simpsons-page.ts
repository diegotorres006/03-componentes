import { ChangeDetectionStrategy, Component, effect, inject, resource, signal } from '@angular/core';
import { SimpsonsService } from '../simpsons/services/simpsons-service';
import { rxResource, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { RouterLink } from '@angular/router';
import { PaginationComponent } from '../../shared/components/pagination/pagination';
import { HeroSimpsons } from "../simpsons/components/hero-simpsons/hero-simpsons";
import { Breadcumbs } from "../../shared/components/breadcrumbs/breadcrumbs";
import { BackToTop } from "../../shared/components/back-to-top/back-to-top";
import { PaginationService } from '../service/paginationservice';

@Component({
  selector: 'app-simpsons-page',
  imports: [RouterLink, PaginationComponent, HeroSimpsons, Breadcumbs, BackToTop],
  templateUrl: './simpsons-page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SimpsonsPage {

  // Signal que mantiene el número total de páginas
  totalPages = signal(0);

  constructor() {
    // Effect que actualiza el número de páginas cuando hay datos válidos
    effect(() => {
      if (this.simpsonsResource.hasValue()) {
        this.totalPages.set(this.simpsonsResource.value().pages);
      }
    });
  }

  charactersPerPage(): number {
    return 5;
  }

  private simpsonsService = inject(SimpsonsService);
  paginationService = inject(PaginationService);

  simpsonsResource = rxResource({
    params: () => ({
      page: this.paginationService.currentPage() - 1,
      limit: this.charactersPerPage(),
    }),
    stream: ({ params }) => {
      return this.simpsonsService.getCharactersOptions({
        offset: params.page,
        limit: params.limit,
      });
    },
  });
}