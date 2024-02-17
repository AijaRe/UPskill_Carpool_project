import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root',
})
export class EdicaoUtilizadorService {
  private carpoolUrl: string = environment.carpoolUrl;
  private carrosUrl: string = environment.carrosUrl;

  constructor(private edicaoUtilizador: HttpClient) {}

  getUtilizador(): Observable<any[]> {
    // Recupera o token do armazenamento local
    const token = localStorage.getItem('token');

    // Verifica se o token existe
    if (token) {
      // Decodifica o token para extrair o ID do usuário
      const decodedToken: any = jwtDecode(token);
      const userID: string = decodedToken.id;

      // Configura os cabeçalhos HTTP com o token
      const headers = new HttpHeaders({ Authorization: `${token}` });

      // Constrói a URL com o ID do usuário
      const url = `${this.carpoolUrl}/user/${userID}`;

      // Faz a solicitação HTTP GET
      return this.edicaoUtilizador.get<any[]>(url, { headers });
    } else {
      // Trata o caso em que o token é nulo
      // Pode retornar um Observable que emite um erro ou algum valor padrão
      // Para fins de demonstração, vamos retornar um Observable vazio
      return new Observable<any[]>((observer) => observer.next([]));
    }
  }

  atualizarPassword(data: any): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `${token}` });
    const url = `${this.carpoolUrl}/user/change-password`;

    return this.edicaoUtilizador.patch(url, data, { headers });
  }

  esquecerUtilizador(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({ Authorization: `${token}` });
    const url = `${this.carpoolUrl}/user/forget`;

    return this.edicaoUtilizador.patch(url, {}, { headers });
  }

  getBoleiasPassadas(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `${token}` };
    const url = `${this.carpoolUrl}/boleias/minhasBoleias`;

    return this.edicaoUtilizador.get<any[]>(url, { headers });
  }
}
