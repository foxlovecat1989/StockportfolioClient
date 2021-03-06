import { EventEmitter, Injectable } from '@angular/core';
import { Watchlist } from '../model/watchlist';

@Injectable({
  providedIn: 'root'
})
export class ReloadService {
  reloadEvent = new EventEmitter();
  reloadHeaderEvent = new EventEmitter<boolean>();
  reloadWatchlistEvent = new EventEmitter<{'watchlist': Watchlist, 'isCreate': boolean}>();
  constructor() { }
}
