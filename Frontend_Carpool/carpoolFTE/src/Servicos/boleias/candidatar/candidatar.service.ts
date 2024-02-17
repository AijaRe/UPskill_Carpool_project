import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class CandidatarService {
  constructor(private http: HttpClient, private router: Router) {}

  candidatar(ofertaBoleiaId: string): Observable<any> {
    // Obtenha o token do armazenamento local
    const token = localStorage.getItem('token');

    // Verifique se há um token antes de fazer a solicitação
    if (!token) {
      console.error('Token not found');
      alert('Para se candidatar tem que ter conta criada!');
      this.router.navigate(['/registo']);
    }

    // Adicione o token como parte do cabeçalho de autorização
    const headers = {
      Authorization: `${token}`,
    };

    // Corpo da solicitação (ofertaBoleiaId deve ser passado como parte do corpo)
    const body = {
      ofertaBoleia: ofertaBoleiaId,
    };

    // Faça a solicitação POST
    return this.http.post<any>('http://localhost:3000/api/candidatura', body, {
      headers,
    });
  }
}
