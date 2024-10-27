import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";

interface User {
  email?: string;
  lastName?: string;
  isAdmin?: boolean;
  firstName?: string;
}

interface LoginModel {
  email: string;
  password: string;
}

interface UserModel {
  email: string;
  password: string;
  lastName: string;
  firstName: string;
}

interface LoginResponse {
  user: User;
  token: string;
  message: string;
}

interface RegisterResponse {
  message: string;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(private http: HttpClient) {}

  login({ email, password }: LoginModel): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, { email, password });
  }

  register({ email, password, firstName, lastName }: UserModel): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.apiUrl}/register`, { email, password, firstName, lastName });
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { observe: "response" });
  }
}
