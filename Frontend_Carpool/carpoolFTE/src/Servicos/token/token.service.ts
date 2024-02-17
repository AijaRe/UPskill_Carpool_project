import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private carpoolUrl: string = environment.carpoolUrl;

  constructor(private http: HttpClient) {}

  removeToken(): void {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isLoggedIn(): boolean {
    const token = this.getToken();
    if (!token) {
      return false; // No token found, consider it invalid
    }
    try {
      const [, payload] = token.split('.');
      const decodedPayload = JSON.parse(atob(payload));
      if (decodedPayload && decodedPayload.exp) {
        const expirationDate = new Date(decodedPayload.exp * 1000);
        const now = new Date();
        return expirationDate > now; // Check if token is still valid
      }
    } catch (error) {
      console.error('Error checking token validity:', error);
    }
    return false; // If there's an error, consider it invalid
  }

  logout(): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `${token}` };
    console.log(headers);
    const url = `${this.carpoolUrl}/user/logout`;
    return this.http.post<any>(url, {}, { headers });
  }

  isAdmin(): boolean {
    const token = this.getToken();
    if (token) {
      try {
        const [, payload] = token.split('.');
        const decodedPayload = JSON.parse(atob(payload));
        if (decodedPayload && decodedPayload.tipo) {
          return decodedPayload.tipo === 'admin';
        }
      } catch (error) {
        console.error('Error checking user role:', error);
      }
    }
    return false;
  }
}
