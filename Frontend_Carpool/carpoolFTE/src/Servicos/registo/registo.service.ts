import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class RegistoService {
  private carpoolUrl: string = environment.carpoolUrl;

  constructor(private registoService: HttpClient) {}

  registoCarpool(formData: any): Observable<any> {
    return this.registoService.post<any>(
      `${this.carpoolUrl}/user/registo`,
      formData
    );
  }
}
