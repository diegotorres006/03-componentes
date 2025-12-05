import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { catchError, of, switchMap } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

// --- SERVICIOS ---
// Ajustamos las rutas a lo estándar, pero mantenemos tu lógica de inyección
import { PaginationService } from '../../../app/features/service/paginationservice'; // Ajustado a core/services
import { SimpsonsService } from '../../features/simpsons/services/simpsons-service';     // Ajustado a core/services
import { FavoritesService } from '../simpsons/services/favorites';  // Ajustado con .service
import { AuthService } from '../../core/services/firebase/auth';    // Ajustado con .service

// --- COMPONENTES ---
// Mantenemos tus rutas de componentes personalizados
// Asegúrate de que estos archivos existan en tu proyecto
import { HeroSimpsons } from '../simpsons/components/hero-simpsons/hero-simpsons';
import { PaginationComponent } from '../../shared/components/pagination/pagination';
import { BackToTop } from '../../shared/components/back-to-top/back-to-top';
import { Breadcumbs } from '../../shared/components/breadcrumbs/breadcrumbs';

@Component({
  selector: 'app-simpsons-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    HeroSimpsons,
    PaginationComponent,
    BackToTop,
    Breadcumbs
  ],
  templateUrl: './simpsons-page.html',
  styleUrls: ['./simpsons-page.css']
})
export class SimpsonsPageComponent {
  // Inyecciones
  public paginationService = inject(PaginationService);
  private simpsonsService = inject(SimpsonsService);
  private favoritesService = inject(FavoritesService);
  private authService = inject(AuthService);
  private fb = inject(FormBuilder);
  private toastr = inject(ToastrService); // Notificaciones

  // Estado UI
  charactersPerPage = signal(10);
  totalPages = signal(0);
  
  // SOLUCIÓN: Gestionamos la página actual localmente
  currentPage = signal(1);

  // Triggers
  private reloadFavoritesTrigger = signal(0);
  
  // Estado de Edición y Eliminación
  editingFavoriteId = signal<string | null>(null);
  favoriteToDeleteId = signal<string | null>(null); // ID para el Modal
  
  editForm: FormGroup;

  // --- 1. RECURSO: SIMPSONS ---
  private simpsonsParams$ = computed(() => ({
    page: this.currentPage() - 1,
    limit: this.charactersPerPage()
  }));

  simpsonsResource = toSignal(
    toObservable(this.simpsonsParams$).pipe(
      switchMap(params => this.simpsonsService.getCharactersOptions({
        offset: params.page, 
        limit: params.limit
      })),
      catchError(error => {
        this.toastr.error('No se pudieron cargar los personajes', 'Error de API');
        return of({ results: [], count: 0, pages: 0 });
      })
    ),
    { initialValue: { results: [], count: 0, pages: 0, next: '', prev: '' } }
  );

  // --- 2. RECURSO: FAVORITOS ---
  favoritesResource = toSignal(
    toObservable(this.reloadFavoritesTrigger).pipe(
      switchMap(() => {
        const user = this.authService.currentUser();
        if (!user) return of([]);
        return this.favoritesService.getFavorites();
      })
    ),
    { initialValue: [] }
  );

  // Computed Values
  favorites = computed(() => this.favoritesResource() || []);
  loadingFavorites = signal(false);

  constructor() {
    this.editForm = this.fb.group({
      customName: ['', [Validators.required, Validators.minLength(2)]]
    });

    // Actualizar total de páginas cuando llegan datos
    effect(() => {
      const data = this.simpsonsResource();
      if (data && (data as any).pages) {
        this.totalPages.set((data as any).pages);
      } else if (data && (data as any).totalPages) {
        this.totalPages.set((data as any).totalPages);
      }
    });

    // Recargar favoritos al loguearse
    effect(() => {
      const user = this.authService.currentUser();
      if (user) {
        this.reloadFavoritesTrigger.update(v => v + 1);
      }
    });
  }

  isFavorite(nombre: string): boolean {
    return this.favorites().some(fav => fav.nombre === nombre);
  }

  addToFavorites(character: any) {
    // Usamos coalescencia nula para manejar diferentes estructuras de API
    const nombre = character.character || character.name;
    const imagen = character.image;
    
    if(nombre && imagen) {
        this.loadingFavorites.set(true);
        this.favoritesService.addFavorite(nombre, imagen).subscribe({
            next: () => {
                this.reloadFavorites();
                this.toastr.success(`Agregado a favoritos`, '¡Éxito!');
                this.loadingFavorites.set(false);
            },
            error: (err) => {
                console.error(err);
                this.toastr.error('No se pudo agregar el personaje', 'Error');
                this.loadingFavorites.set(false);
            }
        });
    }
  }

  // --- Lógica del Modal ---
  openDeleteModal(id: string) {
    this.favoriteToDeleteId.set(id);
    const modal = document.getElementById('delete_modal') as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  }

  confirmDelete() {
    const id = this.favoriteToDeleteId();
    if (id) {
        this.favoritesService.deleteFavorite(id).subscribe({
            next: () => {
                this.reloadFavorites();
                this.toastr.info('Personaje eliminado de favoritos', 'Eliminado');
                this.favoriteToDeleteId.set(null);
            },
            error: (err) => {
                this.toastr.error('Error al eliminar', 'Error');
            }
        });
    }
  }

  reloadFavorites() {
    this.reloadFavoritesTrigger.update(v => v + 1);
  }

  // --- Lógica de Edición ---
  startEditingFavorite(favorite: any) {
    this.editingFavoriteId.set(favorite.id);
    this.editForm.patchValue({ customName: favorite.customName });
  }

  saveEditedFavorite() {
    if (this.editForm.invalid) return;
    
    const id = this.editingFavoriteId();
    const customName = this.editForm.value.customName;
    
    if (id && customName) {
      this.favoritesService.updateFavorite(id, customName).subscribe({
        next: () => {
            this.reloadFavorites();
            this.toastr.success('Nombre actualizado correctamente');
            this.cancelEditingFavorite();
        },
        error: () => this.toastr.error('Error al actualizar')
      });
    }
  }

  cancelEditingFavorite() {
    this.editingFavoriteId.set(null);
    this.editForm.reset();
  }

  // Métodos de Paginación Local
  nextPage() {
    this.currentPage.update(page => page + 1);
  }

  prevPage() {
    this.currentPage.update(page => Math.max(1, page - 1));
  }
}