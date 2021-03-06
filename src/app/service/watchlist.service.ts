import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { CustomHttpRespone } from '../model/custom-http-response';
import { Watchlist } from '../model/watchlist';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {

  constructor(
    private http: HttpClient
  ) { }

  getWatchlistsByUserNumber(userNumber: string): Observable<Array<Watchlist>>{
    return this.http.get<Array<Watchlist>>(`${environment.apiUrl}/api/v1/watchlist/findAll/${userNumber}`)
    .pipe(
      map(
        (watchlists: Array<Watchlist>) => {
          const newWatchlists = new Array<Watchlist>();
          watchlists.forEach(watchlist => newWatchlists.push(Watchlist.fromHttp(watchlist)));

          return newWatchlists;
        }
      )
    );
  }

  createWatchlist(watchlistName: string, userNumber: string): Observable<Watchlist>{
    const formObject: {'name': string} = {name: watchlistName};

    return this.http.post<Watchlist>(`${environment.apiUrl}/api/v1/watchlist/create/${userNumber}`, formObject);
  }

  addStockToWatchlist(symbol: string, watchlistId: string): Observable<Watchlist>{
    const formObject: {'id': string, 'symbol': string} = {id: watchlistId, symbol: symbol};

    return this.http.post<Watchlist>(`${environment.apiUrl}/api/v1/watchlist/add/${symbol}`, formObject);
  }

  removeStockToWatchlist(symbol: string, watchlistId: number): Observable<Watchlist>{
    const formObject: {'id': number, 'symbol': string} = {id: watchlistId, symbol: symbol};

    return this.http.post<Watchlist>(`${environment.apiUrl}/api/v1/watchlist/remove/item/${symbol}`, formObject);
  }

  deleteWatchlist(watchlistId: number): Observable<CustomHttpRespone> {
    return this.http.delete<CustomHttpRespone>(`${environment.apiUrl}/api/v1/watchlist/${watchlistId}`);
  }

}
