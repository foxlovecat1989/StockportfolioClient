import { HttpClient, HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { JwtHelperService } from '@auth0/angular-jwt';
import { User } from '../model/user';
import { ReloadService } from './reload.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private token!: string;
  private loggedInUsername!: string;

  constructor(
    private http: HttpClient,
    private helper: JwtHelperService,
    private reloadService: ReloadService
    ) {}

  login(user: User): Observable<HttpResponse<User>> {
    return this.http.post<User>(`${environment.apiUrl}/api/v1/user/login`, user, { observe: 'response' });
  }

  logOut(): void {
    this.token != null;
    this.loggedInUsername != null;
    this.reloadService.reloadHeaderEvent.emit();
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    localStorage.removeItem('stocks');
  }

  saveToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  addUserToLocalCache(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUserFromLocalCache(): User {
    return JSON.parse(localStorage.getItem('user')!);
  }

  loadToken(): void {
    this.token = localStorage.getItem('token')!;
  }

  getToken(): string {
    return this.token;
  }

  isUserLoggedIn(): boolean {
    this.loadToken();
    const decodedTokenSub = this.helper.decodeToken(this.token);
    const isTokenNullOrEmpty = (this.token == null || this.token === '');
    const isTokenSubjectNullOrEmpty = (decodedTokenSub == null || decodedTokenSub === '');
    const isTokenExpired = this.helper.isTokenExpired(this.token);

    if (isTokenNullOrEmpty || isTokenSubjectNullOrEmpty || isTokenExpired){
      this.logOut();
      return false;
    }
    this.loggedInUsername = decodedTokenSub;

    return true;
  }

  isAdmin(): boolean {
    const role = this.getUserFromLocalCache()?.userRole?.substring(5).toUpperCase();
    const isAdmin = (role === 'ADMIN') || (role === 'MANAGER');

    return isAdmin;
  }
}
