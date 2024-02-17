import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LoginService {
  private carpoolUrl: string = environment.carpoolUrl;

  constructor(private http: HttpClient) {}

  loginCarpool(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.carpoolUrl}/user/login`, {
      email,
      password,
    });
  }
}
