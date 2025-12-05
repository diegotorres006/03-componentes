import { Injectable, inject, signal } from '@angular/core';
import { 
  Auth, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  user, 
  User,
  GoogleAuthProvider, // <--- Importante
  signInWithPopup     // <--- Importante
} from '@angular/fire/auth';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth: Auth = inject(Auth);
  
  currentUser = signal<User | null>(null);
  user$ = user(this.auth);

  constructor() {
    this.user$.subscribe(user => {
      this.currentUser.set(user);
    });
  }

  register(email: string, password: string): Observable<any> {
    const promise = createUserWithEmailAndPassword(this.auth, email, password);
    return from(promise);
  }

  login(email: string, password: string): Observable<any> {
    const promise = signInWithEmailAndPassword(this.auth, email, password);
    return from(promise);
  }

  // --- LOGIN CON GOOGLE (Ahora activo) ---
  loginWithGoogle(): Observable<any> {
    const provider = new GoogleAuthProvider();
    const promise = signInWithPopup(this.auth, provider);
    return from(promise);
  }

  logout(): Observable<void> {
    const promise = signOut(this.auth);
    return from(promise);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }
}