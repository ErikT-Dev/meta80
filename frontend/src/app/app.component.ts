import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule
  ],
  template: `
    <router-outlet></router-outlet>
  `,
  styles: []
})
export class AppComponent implements OnInit {
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.checkSession();
  }

  private checkSession() {
    if (this.authService.currentUserValue) {
      this.authService.checkSession().subscribe(
        () => {
          console.log('Session is valid');
        },
        error => {
          console.error('Session expired or invalid', error);
          // Additional error handling if needed
        }
      );
    }
  }
}