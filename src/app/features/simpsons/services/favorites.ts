import { Injectable, inject, signal } from '@angular/core';
import { 
  Firestore, 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  Timestamp 
} from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../../app/core/services/firebase/auth';
import { Favorite } from '../../../features/simpsons/interfaces/Favorite.interface';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private firestore: Firestore = inject(Firestore);
  private authService = inject(AuthService);
  
  // Signals para estado local
  favorites = signal<Favorite[]>([]);
  loading = signal(false);

  /**
   * Agregar un favorito a Firestore
   */
  addFavorite(nombre: string, image: string, customName?: string): Observable<any> {
    const user = this.authService.currentUser();
    
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    // Preparamos el objeto a guardar (sin ID aún)
    const favorite: Omit<Favorite, 'id'> = {
      nombre,
      customName: customName || nombre,
      image,
      userId: user.uid,
      createdAt: new Date()
    };

    const favoritesCollection = collection(this.firestore, 'favorites');
    
    // Guardamos convirtiendo la fecha a Timestamp de Firestore
    return from(addDoc(favoritesCollection, {
      ...favorite,
      createdAt: Timestamp.fromDate(favorite.createdAt)
    }));
  }

  /**
   * Obtener todos los favoritos del usuario actual
   */
  getFavorites(): Observable<Favorite[]> {
    const user = this.authService.currentUser();
    
    if (!user) {
      return from([[]]);
    }

    this.loading.set(true);
    
    const favoritesCollection = collection(this.firestore, 'favorites');
    // Query para traer solo los favoritos de ESTE usuario
    const q = query(favoritesCollection, where('userId', '==', user.uid));
    
    return from(getDocs(q)).pipe(
      map(snapshot => {
        const favorites = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            // Convertimos el Timestamp de vuelta a Date de JS
            createdAt: data['createdAt']?.toDate() || new Date()
          } as Favorite;
        });
        
        // Actualizamos el signal local
        this.favorites.set(favorites);
        this.loading.set(false);
        return favorites;
      })
    );
  }

  /**
   * Actualizar el nombre personalizado de un favorito
   */
  updateFavorite(id: string, customName: string): Observable<void> {
    const favoriteDoc = doc(this.firestore, 'favorites', id);
    return from(updateDoc(favoriteDoc, { customName }));
  }

  /**
   * Eliminar un favorito
   */
  deleteFavorite(id: string): Observable<void> {
    const favoriteDoc = doc(this.firestore, 'favorites', id);
    return from(deleteDoc(favoriteDoc));
  }

  /**
   * Verificar si un personaje ya está en la lista local de favoritos
   */
  isFavorite(nombre: string): boolean {
    return this.favorites().some(fav => fav.nombre === nombre);
  }
}