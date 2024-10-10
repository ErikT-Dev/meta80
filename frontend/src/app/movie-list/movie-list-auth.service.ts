import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from '../auth.service';
import { LoginDialogComponent } from '../dialogs/login-dialog.component';
import { RegisterDialogComponent } from '../dialogs/register-dialog.component';
import { MovieListService } from './movie-list.service';

@Injectable({
    providedIn: 'root'
})
export class MovieListAuthService {
    constructor(
        private authService: AuthService,
        private dialog: MatDialog,
        private snackBar: MatSnackBar,
        private movieListService: MovieListService
    ) { }

    get currentUser$() {
        return this.authService.currentUser;
    }

    checkSession() {
        if (this.authService.currentUserValue) {
            this.authService.checkSession().subscribe(
                () => {
                    console.log('Session is valid');
                },
                error => {
                    console.error('Session expired or invalid', error);
                    this.handleSessionExpired();
                }
            );
        }
    }

    private handleSessionExpired() {
        this.authService.logout().subscribe(() => {
            this.snackBar.open('Your session has expired. Please log in again.', 'Close', {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
            });
            this.movieListService.loadMovies(); // Reload movies without user-specific data
        });
    }

    openLoginDialog() {
        const dialogRef = this.dialog.open(LoginDialogComponent, { width: '300px' });
        dialogRef.afterClosed().subscribe(result => this.handleLoginResult(result));
    }

    openRegisterDialog() {
        const dialogRef = this.dialog.open(RegisterDialogComponent, { width: '300px' });
        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                console.log('Registration successful');
            }
        });
    }

    private handleLoginResult(result: any) {
        if (result === true) {
            this.movieListService.loadMovies();
            this.snackBar.open('Login successful', 'Close', {
                duration: 3000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
            });
        } else if (result) {
            this.snackBar.open('Login failed: ' + (result.error?.message || 'Invalid credentials'), 'Close', {
                duration: 5000,
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
            });
        }
    }

    logout() {
        this.authService.logout().subscribe(() => {
            console.log('User logged out');
            this.movieListService.loadMovies();
        });
    }
}