import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject, throwError } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';
import { environment } from '../environments/environment.prod';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private currentUserSubject: BehaviorSubject<any>;
    public currentUser: Observable<any>;
    public userLoggedOut = new Subject<void>();
    public userLoggedIn = new Subject<any>();
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<any>(JSON.parse(localStorage.getItem('currentUser') || 'null'));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue() {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string) {
        return this.http.post<any>(`${this.apiUrl}/login`, { email, password }, { withCredentials: true })
            .pipe(
                map(response => {
                    const user = response.user;
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                    this.userLoggedIn.next(user);
                    return user;
                }),
                catchError(this.handleError)
            );
    }

    checkSession(): Observable<any> {
        return this.http.get(`${this.apiUrl}/check-session`, { withCredentials: true })
            .pipe(
                tap(user => {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }),
                catchError(error => {
                    this.logout();
                    return throwError(error);
                })
            );
    }

    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'An error occurred';
        if (error.error instanceof ErrorEvent) {
            // Client-side error
            errorMessage = error.error.message;
        } else {
            // Server-side error
            errorMessage = error.error.message || `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(errorMessage);
    }

    logout() {
        localStorage.removeItem('currentUser');
        this.currentUserSubject.next(null);
        return this.http.get(`${this.apiUrl}/logout`, { withCredentials: true });
    }

    register(user: { email: string, password: string, name: string }) {
        return this.http.post(`${this.apiUrl}/register`, user, { withCredentials: true });
    }

    toggleSeenlist(movieId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/toggle-seenlist`, { movieId }, { withCredentials: true }).pipe(
            tap(response => {
                const user = this.currentUserValue;
                if (user) {
                    user.seenlist = response.seenlist;
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
            })
        );
    }

    isInSeenlist(movieId: string): boolean {
        const user = this.currentUserValue;
        return user && user.seenlist && user.seenlist.includes(movieId);
    }

    toggleWatchlist(movieId: string): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/toggle-watchlist`, { movieId }, { withCredentials: true }).pipe(
            tap(response => {
                const user = this.currentUserValue;
                if (user) {
                    user.watchlist = response.watchlist;
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    this.currentUserSubject.next(user);
                }
            })
        );
    }

    isInWatchlist(movieId: string): boolean {
        const user = this.currentUserValue;
        return user && user.watchlist && user.watchlist.includes(movieId);
    }
}