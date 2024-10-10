import { Component } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AuthService } from '../auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-login-dialog',
  template: `
    <h2 mat-dialog-title>Login</h2>
    <mat-dialog-content>
      <form (ngSubmit)="onSubmit()">
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
      <button mat-button color="primary" (click)="onSubmit()">Login</button>
    </mat-dialog-actions>
  `,
  standalone: true,
  imports: [CommonModule, FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatDialogModule]
})
export class LoginDialogComponent {
  email: string = '';
  password: string = '';

  constructor(
    private dialogRef: MatDialogRef<LoginDialogComponent>,
    private authService: AuthService
  ) { }

  onSubmit() {
    this.authService.login(this.email, this.password).subscribe(
      (user) => {
        this.dialogRef.close(true);
      },
      (error) => {
        this.dialogRef.close(error);
      }
    );
  }

  onCancel() {
    this.dialogRef.close(false);
  }
}