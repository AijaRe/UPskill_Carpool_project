import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PerfilUtilizadorService {
  constructor(
    private perfilUtilizadorService: HttpClient,
    private router: Router
  ) {}
  private carpoolUrl: string = environment.carpoolUrl;
  private carrosUrl: string = environment.carrosUrl;

  //Candidaturas pendentes de ser aceites ou recusadas (vista do passageiro)
  getMinhasCandidaturas(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `${token}` };
    const url = `${this.carpoolUrl}/Candidatura/minhasCandidaturas`;

    return this.perfilUtilizadorService.get<any[]>(url, { headers });
  }

  //Candidaturas visiveis ao condutor para aceitar ou recusar os passageiros
  getCandidaturasParaCondutor(): Observable<any[]> {
    // Obtenha o token do armazenamento local
    const token = localStorage.getItem('token');
    const url = `${this.carpoolUrl}/Candidatura/paraCondutor`;
    const headers = {
      Authorization: `${token}`,
    };

    return this.perfilUtilizadorService.get<any[]>(url, { headers });
  }

  DecidirCandidatura(
    candidaturaId: string,
    novoEstado: string
  ): Observable<any> {
    // Obtenha o token do armazenamento local
    const token = localStorage.getItem('token');
    const headers = { Authorization: `${token}` };
    const url = `${this.carpoolUrl}/candidatura/${candidaturaId}`;
    const body = { estado: novoEstado };

    return this.perfilUtilizadorService.patch<any[]>(url, body, { headers });
  }

  getBoleiasPorTerminar(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `${token}` };
    const url = `${this.carpoolUrl}/boleias/nao/terminado`;

    return this.perfilUtilizadorService.get<any[]>(url, { headers });
  }

  getBoleiasTerminadasPorAvaliar(): Observable<any[]> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `${token}` };
    const url = `${this.carpoolUrl}/boleias/nao/avaliada`;

    return this.perfilUtilizadorService.get<any[]>(url, { headers });
  }

  terminarBoleia(boleiaID: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `${token}` };
    const url = `${this.carpoolUrl}/boleias/${boleiaID}/terminar`;

    const body = {
      terminado: true,
    };

    return this.perfilUtilizadorService.patch<any[]>(url, body, { headers });
  }

  avaliarBoleia(boleiaID: string, avaliacao: number): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `${token}` };
    const url = `${this.carpoolUrl}/boleias/${boleiaID}/avaliar`;

    const body = {
      avaliacao: avaliacao,
    };

    return this.perfilUtilizadorService.patch<any[]>(url, body, { headers });
  }

  getOfertasBoleiasPendentes(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `${token}` };
    const url = `${this.carpoolUrl}/ofertaBoleia/pendentes`;

    return this.perfilUtilizadorService.get<any[]>(url, { headers });
  }

  cancelarBoleiasPendentes(ofertaBoleiaID: string): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `${token}` };
    const url = `${this.carpoolUrl}/ofertaBoleia/cancelar/${ofertaBoleiaID}`;

    return this.perfilUtilizadorService.patch<any[]>(
      url,
      { cancelada: true },
      { headers }
    );
  }

  getBoleiasPorUser(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `${token}` };
    const url = `${this.carpoolUrl}/boleias`;

    return this.perfilUtilizadorService.get<any[]>(url, { headers });
  }


}
