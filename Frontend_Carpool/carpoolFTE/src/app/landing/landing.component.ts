import { Component, OnInit } from '@angular/core';
import { GeoApiService } from 'src/Servicos/GeoApi/geo-api.service';
import { VerOfertasBoleiasService } from 'src/Servicos/boleias/verOfertasBoleia/ver-ofertas-boleias.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
})
export class LandingComponent implements OnInit {
  municipiosFreguesias!: any[];
  municipioEscolhidoOrigem!: string;
  municipioEscolhidoDestino!: string;

  pesquisaForm = {
    partidaMunicipio: '',
    destinoMunicipio: '',
    data: '',
  };
  constructor(private servicoGeo: GeoApiService, private router: Router) {}

  ngOnInit(): void {
    this.CarregarFreguesiasMunicipios();
  }

  CarregarFreguesiasMunicipios() {
    this.servicoGeo.getMunicipiosFreguesias().subscribe(
      (municipiosFreguesias: any[]) => {
        this.municipiosFreguesias = municipiosFreguesias;
        console.log(this.municipiosFreguesias);
      },
      (error) => {
        console.error('Erro ao ir buscar municipios e Freguesias', error);

        if (error.error && error.error.erro) {
          console.error('Mensagem de erro do servidor:', error.error.erro);
        }
      }
    );
  }

  onSubmit() {
    // Remove empty parameters
    const queryParams = Object.fromEntries(
      Object.entries(this.pesquisaForm).filter(([_, v]) => v !== '')
    );
    //verificar parametros
    console.log(this.pesquisaForm);
    // Usar o queryParams para passar os dados filtrados
    this.router.navigate(['/verBoleias'], {
      queryParams: queryParams,
    });
  }
}
