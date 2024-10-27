import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class SessionService {
  private tokenKey = "authToken";
  private userProfileKey = "userProfile";

  private isAuthenticatedSubject = new BehaviorSubject<boolean>(this.isAuthenticated());
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {}

  setToken(token: string): void {
    sessionStorage.setItem(this.tokenKey, token);
    this.isAuthenticatedSubject.next(true);
  }

  getToken(): string | null {
    return sessionStorage.getItem(this.tokenKey);
  }

  clearToken(): void {
    sessionStorage.removeItem(this.tokenKey);
    this.isAuthenticatedSubject.next(false);
  }

  setUserProfile(profile: any): void {
    sessionStorage.setItem(this.userProfileKey, JSON.stringify(profile));
  }

  getUserProfile(): any {
    const profile = sessionStorage.getItem(this.userProfileKey);
    return profile ? JSON.parse(profile) : null;
  }

  clearUserProfile(): void {
    sessionStorage.removeItem(this.userProfileKey);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  isAdmin(): boolean {
    const { isAdmin = false } = JSON.parse(sessionStorage.getItem(this.userProfileKey) || "{}");
    return isAdmin;
  }
}
