import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OfertaBoleiasService {
  private carpoolUrl: string = environment.carpoolUrl;
  private carrosUrl: string = environment.carrosUrl;

  constructor(private ofertaBoleiaService: HttpClient) {}

  criarOfertaBoleia(formData: any): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `${token}` };
    const url = `${this.carpoolUrl}/ofertaBoleia`;
    return this.ofertaBoleiaService.post<any>(url, formData, { headers });
  }

  getCarros(): Observable<any[]> {
    const token = this.getToken();
    const headers = { Authorization: `${token}` };
    const url = `${this.carrosUrl}/carros`;
    return this.ofertaBoleiaService.get<any[]>(url, { headers });
  }

  getCarro(id: string): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `${token}` };
    const url = `${this.carrosUrl}/carros/id/${id}`;
    return this.ofertaBoleiaService.get<any>(url, { headers });
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
