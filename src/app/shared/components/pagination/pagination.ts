import { ChangeDetectionStrategy, Component, computed, input, linkedSignal } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-pagination-component',
  imports: [RouterLink],
  standalone: true,
  templateUrl: './pagination.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaginationComponent {
  pages = input(0);
  currentPage = input<number>(1);
  activePage = linkedSignal(this.currentPage);

  getPagesList = computed(() => {
    const totalPages = this.pages();
    const current = this.activePage();

    if (totalPages <= 5) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const start = Math.max(1, current - 2);
    const end = Math.min(totalPages, start + 4);

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

 previousPage() {
    if (this.activePage() > 1) this.activePage.update((n) => n - 1);
  }

  nextPage() {
    if (this.activePage() < this.pages()) this.activePage.update((n) => n + 1);
  }

 }