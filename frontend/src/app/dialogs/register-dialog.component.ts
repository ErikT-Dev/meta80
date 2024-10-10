import { Component } from '@angular/core';
import { MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-register-dialog',
  template: `
    <h2 mat-dialog-title>Register</h2>
    <mat-dialog-content>
      <form (ngSubmit)="onSubmit()">
        <mat-form-field>
          <input matInput [(ngModel)]="name" name="name" type="text" placeholder="Name" required>
        </mat-form-field>
        <mat-form-field>
          <input matInput [(ngModel)]="email" name="email" type="email" placeholder="Email" required>
        </mat-form-field>
        <mat-form-field>
          <input matInput [(ngModel)]="password" name="password" type="password" placeholder="Password" required>
        </mat-form-field>
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="onCancel()">Cancel</button>
      <button mat-button color="primary" (click)="onSubmit()">Register</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule]
})
export class RegisterDialogComponent {
  name: string = '';
  email: string = '';
  password: string = '';

  constructor(
    private dialogRef: MatDialogRef<RegisterDialogComponent>,
    private authService: AuthService
  ) { }

  onSubmit() {
    this.authService.register({ name: this.name, email: this.email, password: this.password })
      .subscribe(
        () => {
          this.dialogRef.close(true);
        },
        error => {
          console.error('Registration failed', error);
          // Handle error (e.g., show error message)
        }
      );
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}