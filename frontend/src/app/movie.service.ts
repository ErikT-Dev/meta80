import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { SortOption } from './filter.service';
import { environment } from '../environments/environment.prod';

export interface Movie {
    _id: string;
    mcListNumber: number,
    mcTitle: String,
    mcYear: number,
    mcRating: number,
    tmdbData: {
        budget: number;
        genres: Array<{ id: number; name: string }>;
        imdb_id: string;
        original_title: string;
        overview: string;
        poster_path: string;
        backdrop_path: String,
        production_companies: Array<{ id: number; name: string }>;
        production_countries: Array<{ iso_3166_1: string; name: string }>;
        revenue: number;
        runtime: number;
        spoken_languages: Array<{ english_name: string; iso_639_1: string; name: string }>;
        tagline: string;
        title: string;
        cast: Array<{ original_name: string; character: string }>;
        directors: string[];
        writers: string[];
    };
    omdbData: {
        imdbRating: string;
        Released: string;
        Year: string;
        BoxOffice: string;
        Ratings: Array<{ Source: string; Value: string }>;
    };
}

export interface MovieResponse {
    movies: Movie[];
    total: number;
    page: number;
    pages: number;
}

export interface FilterOptions {
    decade?: string | null;
    genres?: string[];
    countries?: string[];
    directors?: string[];
    sortBy?: SortOption;
    sortOrder?: 'asc' | 'desc';
    page?: number;
    limit?: number;
    watchlist?: boolean;
    seenlist?: boolean;
    showDocumentaries?: boolean;
}

@Injectable({
    providedIn: 'root'
})
export class MovieService {
    private apiUrl = environment.apiUrl;

    constructor(private http: HttpClient, private router: Router) { }

    getMovies(options: FilterOptions): Observable<MovieResponse> {
        let params = new HttpParams();

        if (options.decade) params = params.set('decade', options.decade);
        if (options.genres?.length) params = params.set('genres', options.genres.join(','));
        if (options.countries?.length) params = params.set('countries', options.countries.join(','));
        if (options.directors?.length) params = params.set('directors', options.directors.join(','));
        if (options.sortBy) params = params.set('sortBy', options.sortBy);
        if (options.sortOrder) params = params.set('sortOrder', options.sortOrder);
        if (options.page) params = params.set('page', options.page.toString());
        if (options.limit) params = params.set('limit', options.limit.toString());
        if (options.watchlist !== undefined) params = params.set('watchlist', options.watchlist.toString());
        if (options.seenlist !== undefined) params = params.set('seenlist', options.seenlist.toString());
        if (options.showDocumentaries !== undefined) {
            params = params.set('showDocumentaries', options.showDocumentaries.toString());
        }

        this.updateUrl(params);
        return this.http.get<MovieResponse>(`${this.apiUrl}/movies`, { params, withCredentials: true });
    }

    private updateUrl(params: HttpParams) {
        const urlTree = this.router.createUrlTree([], {
            queryParams: params.keys().reduce((acc, key) => {
                acc[key] = params.get(key);
                return acc;
            }, {} as { [key: string]: string | null })
        });
        this.router.navigateByUrl(urlTree, { replaceUrl: true });
    }

    getFilterOptions(): Observable<any> {
        return this.http.get(`${this.apiUrl}/movies/filters`);
    }

    getPosterUrl(posterPath: string | null): string {
        if (!posterPath) {
            return 'assets/no-image-available.png';
        }
        return `https://image.tmdb.org/t/p/w500${posterPath}`;
    }

    updateFilterCounts(options: FilterOptions): Observable<any> {
        let params = new HttpParams();
        if (options.decade) params = params.set('decade', options.decade);
        if (options.genres?.length) params = params.set('genres', options.genres.join(','));
        if (options.countries?.length) params = params.set('countries', options.countries.join(','));
        if (options.directors?.length) params = params.set('directors', options.directors.join(','));
        if (options.watchlist !== undefined) params = params.set('watchlist', options.watchlist.toString());
        if (options.seenlist !== undefined) params = params.set('seenlist', options.seenlist.toString());
        if (options.showDocumentaries !== undefined) params = params.set('showDocumentaries', options.showDocumentaries.toString());
        return this.http.get(`${this.apiUrl}/movies/update-filter-counts`, { params, withCredentials: true });
    }

    loadFiltersFromUrl(): FilterOptions {
        const params = new URLSearchParams(window.location.search);
        const options: FilterOptions = {};

        if (params.has('decade')) options.decade = params.get('decade');
        if (params.has('genres')) options.genres = params.get('genres')?.split(',');
        if (params.has('countries')) options.countries = params.get('countries')?.split(',');
        if (params.has('directors')) options.directors = params.get('directors')?.split(',');
        if (params.has('sortBy')) options.sortBy = params.get('sortBy') as SortOption;
        if (params.has('sortOrder')) options.sortOrder = params.get('sortOrder') as 'asc' | 'desc';
        if (params.has('page')) options.page = parseInt(params.get('page') || '1', 10);
        if (params.has('limit')) options.limit = parseInt(params.get('limit') || '20', 10);
        if (params.has('watchlist')) options.watchlist = params.get('watchlist') === 'true';
        if (params.has('seenlist')) options.seenlist = params.get('seenlist') === 'true';
        if (params.has('showDocumentaries')) options.showDocumentaries = params.get('showDocumentaries') === 'true';

        return options;
    }
}