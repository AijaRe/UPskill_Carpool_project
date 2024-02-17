import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidatarService } from 'src/Servicos/boleias/candidatar/candidatar.service';
import { VerOfertasBoleiasService } from 'src/Servicos/boleias/verOfertasBoleia/ver-ofertas-boleias.service';
import { OfertaBoleiasService } from 'src/Servicos/boleias/criarOfertasBoleia/oferta-boleias.service';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { TokenService } from 'src/Servicos/token/token.service';

@Component({
  selector: 'app-ver-todas-ofertas',
  templateUrl: './ver-todas-ofertas.component.html',
  styleUrls: ['./ver-todas-ofertas.component.css'],
})
export class VerTodasOfertasComponent implements OnInit {
  ofertasBoleia: any[] = [];
  loading: boolean = true;
  error: boolean = false;
  carDetailsMap: Map<string, any> = new Map();

  constructor(
    private route: ActivatedRoute,
    private verBoleiasService: VerOfertasBoleiasService,
    private candidatarService: CandidatarService,
    private router: Router,
    private ofertaBoleia: OfertaBoleiasService,
    private tokenService: TokenService
  ) {}

  ngOnInit(): void {
    this.verBoleiasService.getTodasOfertas().subscribe(
      (response: any) => {
        this.ofertasBoleia = response.data;
        console.log(response.data);
        this.loading = false;
      },
      (error) => {
        alert('Não há resultados para a sua pesquisa');
        console.error('Erro ao pesquisar pelas ofertas: ', error);
        this.error = true;
      }
    );
  }

  candidatar(ofertaBoleiaId: string): void {
    this.candidatarService.candidatar(ofertaBoleiaId).subscribe(
      (response) => {
        console.log(response);
        alert('A sua candidatura foi enviada.');
        this.router.navigate(['dashboard']);
      },
      (error) => {
        console.error(error);
        alert('Erro ao enviar candidatura. Tenha em consideração que não se pode candidatar às suas próprias ofertas!');
      }
    );
  }

  getCarDetails(carroId: string): Observable<any> {
    if (this.carDetailsMap.has(carroId)) {
      return of(this.carDetailsMap.get(carroId));
    } else {
      return this.ofertaBoleia.getCarro(carroId).pipe(
        tap((carroDetails: any) => {
          this.carDetailsMap.set(carroId, carroDetails);
        })
      );
    }
  }

  toggleDetails(oferta: any): void {
    oferta.showDetails = !oferta.showDetails;
  }

  isLoggedIn(): boolean {
    return this.tokenService.isLoggedIn();
  }
}
