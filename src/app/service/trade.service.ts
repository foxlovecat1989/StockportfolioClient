import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Trade } from '../model/Trade';
import { User } from '../model/user';
import { AuthenticationService } from './authentication.service';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class TradeService {

  constructor(
    private http: HttpClient,
    private authService: AuthenticationService,
    private userService: UserService
  ) { }

  getTrades(): Observable<Array<Trade>> {

    return this.http.get<Array<Trade>>(environment.apiUrl + '/api/v1/trades/findAll')
    .pipe(
      map(
        datas => {
          const trades = new Array<Trade>();
          console.log(datas)
          datas.forEach(data => {
            trades.push(Trade.fromHttp(data));

          })


          return trades;
        }
      )
    );
  }

  getTradesByDate(userId: number, date: string) : Observable<Trade[]> {

    return this.http.get<Trade[]>(`${environment.apiUrl}/api/v1/trades/findAll/${userId}/2021-12-30`)
      .pipe(
        map (
          datas => {
            const trades = new Array<Trade>();
            datas.forEach(data => trades.push(Trade.fromHttp(data)))

            return trades;
          }
        )
      );
  }

  public createTrade(Trade: Trade): Observable<Trade>{
    return this.http.post<Trade>(environment.apiUrl + '/api/v1/trades/', Trade);
  }
}