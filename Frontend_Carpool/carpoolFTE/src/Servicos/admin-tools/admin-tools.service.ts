import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AdminToolsService {
  private carrosUrl: string = environment.carrosUrl;

  constructor(
    private adminToolService: HttpClient,
    private http: HttpClient,
    private router: Router
  ) {}

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  //Devolve todos os carros
  getCarros(): Observable<any[]> {
    const token = this.getToken();
    const headers = { Authorization: `${token}` };
    const url = `${this.carrosUrl}/carros`;
    return this.adminToolService.get<any[]>(url, { headers });
  }

  //Devolve todas as marcas//
  getMarcas(): Observable<any[]> {
    const token = this.getToken();
    const headers = { Authorization: `${token}` };
    const url = `${this.carrosUrl}/carros/marcas`;
    return this.adminToolService.get<any[]>(url, { headers });
  }

  //Devolve todos os modelos de uma determinada marca
  getModelos(marca: string): Observable<any[]> {
    const token = this.getToken();
    const headers = { Authorization: `${token}` };
    const url = `${this.carrosUrl}/carros/marca/${marca}`;
    return this.http.get<any[]>(url, { headers });
  }

  //Devolve id de um modelo/marca
  getUnico(marca: string, modelo: string): Observable<any[]> {
    const token = this.getToken();
    const headers = { Authorization: `${token}` };
    const url = `${this.carrosUrl}/carros/carro/${marca}/${modelo}`;
    return this.adminToolService.get<any[]>(url, { headers });
  }

  //Criar um carro
  postCarro(formData: any): Observable<any> {
    const token = this.getToken();
    const headers = {
      Authorization: `${token}`,
      'Content-Type': 'application/json',
    };
    const url = `${this.carrosUrl}/carros`;
    return this.adminToolService.post<any>(url, formData, { headers });
  }

  //Editar um carro
  putCarro(marca: string, modelo: string, formData: any): Observable<any> {
    const token = this.getToken();
    const headers = { Authorization: `${token}` };
    const url = `${this.carrosUrl}/carros/${marca}/${modelo}`;
    return this.adminToolService.put<any>(url, formData, { headers });
  }
}
