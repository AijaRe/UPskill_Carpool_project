import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidatarService } from 'src/Servicos/boleias/candidatar/candidatar.service';
import { VerOfertasBoleiasService } from 'src/Servicos/boleias/verOfertasBoleia/ver-ofertas-boleias.service';
import { OfertaBoleiasService } from 'src/Servicos/boleias/criarOfertasBoleia/oferta-boleias.service';

@Component({
  selector: 'app-ver-boleias',
  templateUrl: './ver-boleias.component.html',
  styleUrls: ['./ver-boleias.component.css'],
})
export class VerBoleiasComponent implements OnInit {
  resultadosPesquisa: any[] = [];
  listaCarros: any[] = [];
  loading: boolean = true;
  error: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private verBoleiasService: VerOfertasBoleiasService,
    private candidatarService: CandidatarService,
    private router: Router,
    private ofertaBoleia: OfertaBoleiasService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      const { partidaMunicipio, destinoMunicipio, data } = params;
      const requestData = {
        partidaMunicipio,
        destinoMunicipio,
        data: data || '',
      };

      this.verBoleiasService
        .getOfertasBoleia(
          requestData.partidaMunicipio,
          requestData.destinoMunicipio,
          requestData.data
        )
        .subscribe(
          (response: any) => {
            this.resultadosPesquisa = response.data;
            console.log(response.data);
            this.loading = false;
          },
          (error) => {
            alert('Não há resultados para a sua pesquisa');
            console.error('Erro ao pesquisar pelas ofertas: ', error);
            this.error = true;
            this.router.navigate(['/todasOfertas']);
          }
        );
    });

    this.CarregarCarros();
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
        alert('Erro ao enviar candidatura.');
      }
    );
  }

  getCarDetails(carroId: string): any {
    return this.listaCarros.find((carro) => carro._id === carroId);
  }

  CarregarCarros() {
    this.ofertaBoleia.getCarros().subscribe(
      (listaCarros: any[]) => {
        this.listaCarros = listaCarros;
      },
      (error) => {
        console.error('Erro ao buscar os carros', error);
      }
    );
  }
}
