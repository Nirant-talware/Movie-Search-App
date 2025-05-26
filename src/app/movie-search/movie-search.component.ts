import { Component } from '@angular/core';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-movie-search',
  standalone: false,
  templateUrl: './movie-search.component.html',
  styleUrl: './movie-search.component.css'
})
export class MovieSearchComponent {
  movieSearchTerm = ''; 
  movies: any[] = [];   
  isLoading = false;
  errorMessage = '';   
  currentPage = 1;    
  showLoadMoreBtn = false; 
  errorImg = 'assets/images/Not Found.jpg';

  constructor(private movieService: MovieService) {}

  // On input change, show or hide the clear button and enable/disable the search button
  onSearchTermChange() {
    this.errorMessage = '';
  }

  onEnterPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.searchMovie();
    }
  }
  

  // Clears the search term and error message
  clearSearch() {
    this.movieSearchTerm = '';
    this.errorMessage = '';
    this.showLoadMoreBtn = false;
    this.isLoading = false;
  }

  // Searches for movies
  searchMovie() {
    this.currentPage = 1;
    this.movies = [];
    this.showLoadMoreBtn = false;
    this.errorMessage = '';
    this.isLoading = true;
    
    this.movieService.searchMovies(this.movieSearchTerm, this.currentPage).subscribe(
      data => {

        if (data.Response === 'True') {
          this.movies = data.Search;
          if (data.totalResults > this.currentPage * 10) {
            this.showLoadMoreBtn = true;
          }
        } else {
          this.errorMessage = 'No movies found!';
        }
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        this.errorMessage = 'Error fetching movie details.';
      }
    );
  }

  loadMoreMovies() {
    this.isLoading = true;
    this.currentPage++;
    this.movieService.searchMovies(this.movieSearchTerm, this.currentPage).subscribe(
      data => {
        this.isLoading = false;
        if (data.Response === 'True') {
          this.movies.push(...data.Search);
          if (data.totalResults <= this.currentPage * 10) {
            this.showLoadMoreBtn = false;
          }
        } else {
          this.errorMessage = 'No Movies Found!'
        }
      },
      error => {
        this.isLoading = false;
        this.errorMessage = 'Error fetching movie details.';
      }
    );
  }

  saveToFavorites(imdbID: string) {
    const favoriteMovies = JSON.parse(localStorage.getItem('favoriteMovies') || '[]');
    if (!favoriteMovies.includes(imdbID)) {
      favoriteMovies.push(imdbID);
      localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
      alert('Movie added to favorites!');
    } else {
      alert('This movie is already in your favorites.');
    }
  }
}
