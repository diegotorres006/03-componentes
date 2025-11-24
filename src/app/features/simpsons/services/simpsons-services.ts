import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment.development';
import { SimpsonsCharacter, SimpsonsCharacterDetail, SimpsonsResponse } from '../interfaces/simpsons.interfaces';



@Injectable({ providedIn: 'root' })
export class SimpsonsService {
  private http = inject(HttpClient);
  private readonly API_URL = environment.apiUrl;

  getCharacters(page: number = 1): Observable<SimpsonsResponse> {
    return this.http.get<SimpsonsResponse>(`${this.API_URL}/characters?page=${page}`).pipe(
      map(res => res),
      catchError(err => {
        console.error('Error al obtener personajes', err);
        return of({ count: 0, next: null, prev: null, pages: 0, results: [] });
      })
    );
  }

  getCharacterById(id: number): Observable<SimpsonsCharacterDetail | null> {
    return this.http.get<SimpsonsCharacterDetail>(`${this.API_URL}/characters/${id}`).pipe(
      catchError(err => {
        console.error('Personaje no encontrado', err);
        return of(null);
      })
    );
  }
}