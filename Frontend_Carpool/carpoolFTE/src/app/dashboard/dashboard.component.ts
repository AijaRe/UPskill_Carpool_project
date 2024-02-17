import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { GeoApiService } from 'src/Servicos/GeoApi/geo-api.service';
import { PerfilUtilizadorService } from 'src/Servicos/PerfilServicos/Dashboard/perfil-utilizador.service';
import { OfertaBoleiasService } from 'src/Servicos/boleias/criarOfertasBoleia/oferta-boleias.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  municipiosFreguesias!: any[];
  municipioEscolhidoOrigem!: string;
  municipioEscolhidoDestino!: string;
  candidaturasPendentes: any[] = [];
  candidaturasPendentesParaCondutor: any[] = [];
  boleiasGeral: any[] = [];
  boleiasPorTerminar: any[] = [];
  boleiasTerminadasPorAvaliar: any[] = [];
  listaCarros: any[] = [];
  ofertasBoleiasPendentes:any[]= [];
  avaliacao: number = 1; // Valor padrão para a avaliação
listaBoleias:any[]=[];
  pesquisaForm = {
    partidaMunicipio: "",
    destinoMunicipio: "",
    data: ""
  };



  constructor(
    private servicoGeo: GeoApiService,
    private router: Router,
    private perfilService: PerfilUtilizadorService,
    private perfilUtilizadorService: PerfilUtilizadorService,
    private ofertaBoleia: OfertaBoleiasService
  ) {}

  ngOnInit(): void {
    this.CarregarFreguesiasMunicipios();
    this.CarregarMinhasCandidaturas();
    this.CarregarCandidaturasParaCondutor();
    this.carregarBoleiasPorTerminar();
    this.carregarBoleiasTerminadasPorAvaliar();
    this.CarregarCarros();
    this.carregarOfertasBoleiasPendentes();
    this.CarregarBoleiasPorUser();
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
      queryParams: queryParams
    })
  }


  CarregarMinhasCandidaturas(): void {
    this.perfilUtilizadorService.getMinhasCandidaturas().subscribe(
      (response: any) => {
        if (response && response.data && Array.isArray(response.data)) {
          this.candidaturasPendentes = response.data;
          console.log('Carregar as candidaturas para o passageiro saber o estado: ', this.candidaturasPendentes);
        } else {
          console.error('Resposta inválida do servidor:', response);
        }
      },
      (error) => {
        console.error('Erro ao ir buscar as candidaturas pendentes', error);
        if (error.error && error.error.erro) {
          console.error('Mensagem de erro do servidor:', error.error.erro);
        }
      }
    );
  }

  CarregarCandidaturasParaCondutor(): void {
    this.perfilUtilizadorService.getCandidaturasParaCondutor().subscribe(
      (response: any) => {
        if (response && response.data && Array.isArray(response.data)) {
          this.candidaturasPendentesParaCondutor = response.data;
          console.log('Candidaturas pendentes para o condutor aceitar ou recusar: ', this.candidaturasPendentesParaCondutor);
        } else {
          console.error('Resposta inválida do servidor:', response);
        }
      },
      (error) => {
        console.error('Erro ao ir buscar as candidaturas pendentes', error);
        if (error.error && error.error.erro) {
          console.error('Mensagem de erro do servidor:', error.error.erro);
        }
      }
    );
  }

  carregarBoleiasPorTerminar(): void {
    this.perfilUtilizadorService.getBoleiasPorTerminar().subscribe(
      (response: any) => {
        if (response.success && response.data) {
          this.boleiasPorTerminar = response.data;
          console.log('Boleias por terminar:', this.boleiasPorTerminar);
        } else {
          console.error('Erro ao carregar boleias por terminar:', response);
        }
      },
      error => {
        console.error('Erro ao carregar boleias por terminar:', error);
      }
    );
  }

  carregarOfertasBoleiasPendentes() {
    this.perfilUtilizadorService.getOfertasBoleiasPendentes().subscribe(
      (response: any) => {
        if (response && Array.isArray(response)) {
          this.ofertasBoleiasPendentes = response;
          console.log('Ofertas de boleia pendentes: ', this.ofertasBoleiasPendentes);
        } else {
          console.error('Resposta inválida do servidor: Unexpected response format', response);
        }
      },
      error => {
        console.error('Erro ao carregar boleias por terminar:', error);
      }
    );
  }



  carregarBoleiasTerminadasPorAvaliar() {
    this.perfilUtilizadorService.getBoleiasTerminadasPorAvaliar().subscribe(
      (response: any) => {
        if (response && response.data && Array.isArray(response.data)) {
          this.boleiasTerminadasPorAvaliar = response.data;
          console.log("BoleiasTerminadasPorAvaliar: ", this.boleiasTerminadasPorAvaliar);
        } else {
          console.error('Erro: Os dados retornados não estão no formato esperado:', response);
          this.boleiasTerminadasPorAvaliar = [];
        }
      },
      (error) => {
        console.error('Erro ao buscar boleias por avaliar:', error);
        this.boleiasTerminadasPorAvaliar = []; // Set to an empty array in case of error
      }
    );
  }

  decidirCandidatura(candidaturaId: string, novoEstado: string) {
    this.perfilUtilizadorService.DecidirCandidatura(candidaturaId, novoEstado).subscribe(
      (response) => {
        // Mostrar valores e  mensagem de sucesso
        alert("A candidatura foi atualizada e o passageiro notificado!");
        console.log('Candidatura atualizada com sucesso:', response );
        this.router.navigate(['dashboard']);
      },
      (error) => {
        // Tratamento de erros
        console.error('Error updating candidatura:', error);
      }
    );
  }

  decidirCancelarOferta(ofertaBoleiaID:string){
    this.perfilUtilizadorService.cancelarBoleiasPendentes(ofertaBoleiaID).subscribe(
      (response)=> {
        console.log("A oferta de boleia foi cancelada: ", response);
        alert("A sua oferta de boleia foi cancelada!");
        this.router.navigate(['dashboard']);
      },
      (error)=>{
        console.error('Erro a cancelar a oferta: ', error);
      }
    )
  }

  terminarBoleia(boleiaID: string){
    this.perfilUtilizadorService.terminarBoleia(boleiaID).subscribe(
      (response)=> {
        console.log("A boleia foi terminada", response);
        alert('A sua viagem foi dada como terminada, não se esqueça de avaliar os companheiros de viagem');
        this.router.navigate(['dashboard']);
      },
      (error)=>{
        console.error('Erro ao terminar a boleia: ', error);
        if (error.error && error.error.erro) {
          console.error('Mensagem de erro do servidor:', error.error.erro);
        }
      }
    )
  }


  avaliarBoleia(boleiaID: string, avaliacao: number): void {
    this.perfilUtilizadorService.avaliarBoleia(boleiaID, avaliacao).subscribe(
      (response) => {
        console.log('Avaliação feita com sucesso: ', response);
        alert('Obrigado por avaliar, esperamos que tenha gostado da sua viagem');
        this.router.navigate(['perfil']);
      },
      (error) => {
        console.error('Erro ao avaliar a boleia: ', error);
        if (error.error && error.error.erro) {
          console.error('Mensagem de erro do servidor:', error.error.erro);
        }
      }
    );
  }
 


  CarregarBoleiasPorUser() {
    this.perfilUtilizadorService.getBoleiasPorUser().subscribe(
      (response: any) => {
        if (response && response.data && Array.isArray(response.data)) {
          this.listaBoleias = response.data;
          console.log('Lista Boleias por user: ', this.listaBoleias);
          this.listaBoleias.forEach((listaBoleias) => {
            // Find the corresponding car object in listaCarros based on _id
            const correspondingCar = this.listaCarros.find(
              (carro) => carro._id === listaBoleias.carro
            );

            // Log the mapping
            console.log(
              `Ride offer ID: ${listaBoleias.id} - Corresponding Car:`,
              correspondingCar
            );

            // If a corresponding car is found, add it to listaBoleias
            if (correspondingCar) {
              listaBoleias.carroObject = correspondingCar;
            }
          });
          
        } else {
          console.error('Erro: Os dados retornados não estão no formato esperado:', response);
          this.listaBoleias = [];
        }
      },
      (error) => {
        console.error('Erro ao pesquisar boleias do user:', error);
        if (error.error && error.error.erro) {
          console.error('Mensagem de erro do servidor: ', error.error.erro);
        }
        this.listaBoleias = []; // Set to an empty array in case of error
      }
    );
  }

  
  CarregarCarros(): void {
    // Buscar carros
    this.ofertaBoleia.getCarros().subscribe(
      (listaCarros: any[]) => {
        if (listaCarros && listaCarros.length > 0) {
        // Atribuir a lista de carros obtida à propriedade do componente
        this.listaCarros = listaCarros;
        console.log('Lista de carros carregada: ', this.listaCarros);
        this.CarregarBoleiasPorUser();
      } else {
        console.error('Lista de carros vazia ou indefinida.');
      }
      },
      (error) => {
        console.error('Erro ao buscar os carros', error);
        if (error.error && error.error.erro) {
          console.error('Mensagem de erro do servidor: ', error.error.erro);
        }
      }
    );
  }

  

  getCandidaturasArray(): any[] {
    // Certifique-se de que candidaturasPendentes é um array
    if (Array.isArray(this.candidaturasPendentes)) {
      return this.candidaturasPendentes;
    }
    return [];
  }
}
