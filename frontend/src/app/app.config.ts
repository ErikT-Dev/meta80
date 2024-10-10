import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilterService } from './filter.service';
import { MatExpansionModule } from '@angular/material/expansion';
import { provideAnimations } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(MatExpansionModule),
    provideAnimations(),
    importProvidersFrom(MatMenuModule),
    importProvidersFrom(MatDialogModule),
    importProvidersFrom(MatSnackBarModule),
    FilterService
  ]
};