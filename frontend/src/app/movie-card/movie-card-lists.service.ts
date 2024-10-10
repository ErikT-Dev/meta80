import { Injectable } from '@angular/core';
import { AuthService } from '../auth.service';
import { Observable, forkJoin } from 'rxjs';
import { MovieCardLists } from './movie-card.types';
import { switchMap, map } from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class MovieCardListsService {
    constructor(private authService: AuthService) { }

    getListsStatuses(movieId: string): MovieCardLists {
        return {
            isInWatchlist: this.authService.isInWatchlist(movieId),
            isInSeenlist: this.authService.isInSeenlist(movieId)
        };
    }

    toggleList(movieId: string, listType: 'watchlist' | 'seenlist'): Observable<any> {
        const toggleMethod = listType === 'watchlist'
            ? this.authService.toggleWatchlist.bind(this.authService)
            : this.authService.toggleSeenlist.bind(this.authService);

        return toggleMethod(movieId);
    }

    isUserLoggedIn(): boolean {
        return !!this.authService.currentUserValue;
    }
}