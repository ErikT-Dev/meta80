import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Movie } from '../../movie.service';

interface CastMember {
  name: string;
  character: string;
}

@Component({
  selector: 'app-movie-details-dialog',
  standalone: true,
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './movie-details-dialog.component.html',
  styleUrls: ['./movie-details-dialog.component.css'],
})
export class MovieDetailsDialogComponent implements OnInit {
  directors: string = '';
  writers: string = '';
  castMembers: CastMember[] = [];
  genres: string = '';
  productionCountries: string = '';
  rottenTomatoesRating: string = 'N/A';
  budget: string = '';
  imdbLink: string = '';
  productionCompanies: string = '';
  spokenLanguages: string = '';
  boxOffice: string = '';

  constructor(
    public dialogRef: MatDialogRef<MovieDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public movie: Movie
  ) { }

  ngOnInit() {
    this.directors = this.movie.tmdbData.directors?.join(', ');
    this.writers = this.movie.tmdbData.writers?.join(', ');
    this.castMembers = this.movie.tmdbData.cast?.reduce((acc, c) => {
      if (c.original_name && c.original_name.trim() && c.character && c.character.trim()) {
        acc.push({
          name: c.original_name.trim(),
          character: c.character.trim()
        });
      }
      return acc;
    }, [] as CastMember[]) || [];
    this.genres = this.movie.tmdbData.genres?.map(g => g.name).join(', ') || 'N/A';
    this.productionCountries = this.movie.tmdbData.production_countries?.map(c => c.name).join(', ') || 'N/A';
    this.rottenTomatoesRating = this.getRottenTomatoesRating();

    // New additions
    this.budget = this.movie.tmdbData.budget ? `$${this.formatNumber(this.movie.tmdbData.budget)}` : 'N/A';
    this.imdbLink = this.movie.tmdbData.imdb_id ? `https://www.imdb.com/title/${this.movie.tmdbData.imdb_id}` : '';
    this.productionCompanies = this.movie.tmdbData.production_companies?.map(c => c.name).join(', ') || 'N/A';
    this.spokenLanguages = this.movie.tmdbData.spoken_languages?.map(l => l.english_name).join(', ') || 'N/A';
    this.boxOffice = this.getBoxOffice();
  }

  getPosterUrl(): string {
    return this.movie.tmdbData.poster_path
      ? 'https://image.tmdb.org/t/p/w500' + this.movie.tmdbData.poster_path
      : 'path/to/placeholder-image.jpg'; // Replace with an actual placeholder image path
  }

  getRottenTomatoesRating(): string {
    const rating = this.movie.omdbData?.Ratings?.find(r => r.Source === 'Rotten Tomatoes');
    return rating ? rating.Value : 'N/A';
  }

  getBoxOffice(): string {
    if (this.movie.omdbData.BoxOffice && this.movie.omdbData.BoxOffice !== 'N/A') {
      return this.movie.omdbData.BoxOffice;
    } else if (this.movie.tmdbData.revenue) {
      return `$${this.formatNumber(this.movie.tmdbData.revenue)}`;
    }
    return '';
  }

  formatNumber(num: number): string {
    return num.toLocaleString('en-US');
  }
}