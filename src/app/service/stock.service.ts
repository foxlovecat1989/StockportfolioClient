import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Tstock } from '../model/Tstock';

@Injectable({
  providedIn: 'root'
})
export class StockService {

  constructor(
    private http: HttpClient
  ) { }

  getStockBySymbol(symbol: string): Observable<Tstock>{
    return this.http.get<Tstock>(`${environment.apiUrl}/api/v1/stock/${symbol}`);
  }

  public getStocks(): Observable<Tstock[]> {
    return this.http.get<Tstock[]>(`${environment.apiUrl}/api/v1/stock/findAll`);
  }

  public addStock(formData: FormData): Observable<Tstock> {
    return this.http.post<Tstock>(`${environment.apiUrl}/api/v1/stock`, formData);
  }

  public updateStock(formData: FormData): Observable<Tstock> {
    return this.http.patch<Tstock>(`${environment.apiUrl}/api/v1/stock`, formData);
  }

  public refreshStockPrice(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/stock/refresh`);
  }
}