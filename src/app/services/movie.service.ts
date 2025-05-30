import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MovieService {
  private apiKey = '1bba9bfc';

  constructor(private http: HttpClient) {}

  searchMovies(searchTerm: string, page: number): Observable<any> {
    const url = `https://www.omdbapi.com/?apikey=${this.apiKey}&s=${searchTerm}&page=${page}`;
    return this.http.get<any>(url);
  }
}
