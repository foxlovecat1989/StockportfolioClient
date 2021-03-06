import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { StockReport } from '../model/stock-report';
import { Tstock } from '../model/tstock';

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

   etStockByStockName(name: string): Observable<Tstock>{
    return this.http.get<Tstock>(`${environment.apiUrl}/api/v1/stock?stockName=${name}`);
  }

  getStocks(): Observable<Tstock[]> {
    return this.http.get<Tstock[]>(`${environment.apiUrl}/api/v1/stock/findAll`);
  }

  addStock(stock: Tstock): Observable<Tstock> {
    return this.http.post<Tstock>(`${environment.apiUrl}/api/v1/stock`, stock);
  }

  updateStock(stock: Tstock): Observable<Tstock> {
    return this.http.patch<Tstock>(`${environment.apiUrl}/api/v1/stock`, stock);
  }

  refreshStockPrice(): Observable<any> {
    return this.http.get<any>(`${environment.apiUrl}/api/v1/stock/refresh`);
  }

  addStocksToLocalCache(stocks: Array<Tstock>): void {
    localStorage.setItem('stocks', JSON.stringify(stocks));
  }

  getStockFromLocalCacheBySymbol(symbol: string): Tstock | null {
    const stocks = this.getStocksFromLocalCache();
    if(stocks == null)
      return null;

    return stocks.find(stock => symbol === stock.symbol)!;
  }

  getStockFromLocalCacheByName(name: string): Tstock | null {
    const stocks = this.getStocksFromLocalCache();
    if(stocks == null)
      return null;

    return stocks.find(stock => name === stock.name)!;
  }

  getStocksFromLocalCache(): Array<Tstock> | null {
    if (localStorage.getItem('stocks')) {
        return JSON.parse(localStorage.getItem('stocks')!);
    }
    return null;
  }

  getStockReports(symbol: string, month: number): Observable<Array<StockReport>>{
      return this.http.get<Array<StockReport>>(`${environment.apiUrl}/api/v1/stock/histquotes/${symbol}/${month}`).pipe(
        map(
          nexts => {
            const newStockReports = new Array<StockReport>();
            nexts.forEach(stockReport => newStockReports.push(StockReport.fromHttp(stockReport)));

            return newStockReports;
          }
        )
      );
  }

}
