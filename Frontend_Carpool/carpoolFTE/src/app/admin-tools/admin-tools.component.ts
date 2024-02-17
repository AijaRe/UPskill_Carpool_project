import { Component, OnInit } from '@angular/core';
import { AdminToolsService } from '../../Servicos/admin-tools/admin-tools.service';

@Component({
  selector: 'app-admin-tools',
  templateUrl: './admin-tools.component.html',
  styleUrls: ['./admin-tools.component.css'],
})
export class AdminToolsComponent implements OnInit {
  Carros: any[] = [];
  Marcas: any[] = [];
  Modelos: any[] = [];
  marcaSelecionada: string = '';
  modeloSelecionado: string = '';
  marcaParaAtualizar: string = '';
  modeloParaAtualizar: string = '';
  carroAtual: any = {};
  carroUnicoResult: any[] = [];
  exibirFormularioNovoCarro: boolean = false;
  exibirMarcas: boolean = false;
  novaMarca: string = '';
  novoModelo: string = '';

  constructor(private AdminTools: AdminToolsService) {}

  ngOnInit(): void {
    this.todosCarros();
    this.todasMarcas();
  }

  marcaSelecionadaChange() {
    this.marcaParaAtualizar = this.marcaSelecionada;
  }

  todosCarros() {
    this.AdminTools.getCarros().subscribe(
      (Carros: any[]) => {
        this.Carros = Carros;
        console.log('Carros carregados com sucesso:', this.Carros);
      },
      (error) => {
        console.error('Falha ao carregar a lista de carros:', error);
      }
    );
  }

  todasMarcas() {
    this.AdminTools.getMarcas().subscribe(
      (Marcas: any[]) => {
        this.Marcas = Marcas;
        console.log('Marcas carregadas com sucesso:', this.Marcas);
      },
      (error) => {
        console.error('Erro ao buscar marcas', error);
      }
    );
  }

  pesquisarModelos() {
    if (this.marcaSelecionada) {
      this.AdminTools.getModelos(this.marcaSelecionada).subscribe(
        (modelos: any[]) => {
          this.Modelos = modelos;
          console.log(this.Modelos);
          this.todosCarros();
        },
        (error) => {
          console.error('Erro ao buscar modelos', error);
        }
      );
    } else {
      console.warn('Nenhuma marca selecionada.');
      this.Modelos = [];
    }
  }

  putCarros() {
    if (this.marcaSelecionada && this.modeloSelecionado) {
      this.AdminTools.putCarro(this.marcaSelecionada, this.modeloSelecionado, {
        marca: this.marcaParaAtualizar,
        modelo: this.modeloParaAtualizar
      })
        .subscribe(
          () => {
            console.log(`Carro atualizado com sucesso: Marca ${this.marcaParaAtualizar}, Modelo ${this.modeloParaAtualizar}`);
            alert('Carro atualizado com sucesso.');
            this.todosCarros();
            this.todasMarcas();
          },
          (error) => {
            console.error('Falha ao atualizar o carro:', error);
            alert('Falha ao atualizar o carro. Verifique o console para mais detalhes.');
          }
        );
    } else {
      console.warn(
        'Marca e modelo são necessários para realizar a atualização.'
      );
    }
  }

  modeloSelecionadoChange() {
    if (this.marcaSelecionada && this.modeloSelecionado) {
      this.AdminTools.getUnico(
        this.marcaSelecionada,
        this.modeloSelecionado
      ).subscribe(
        (carro: any) => {
          this.carroAtual = carro;
          // Atualiza os campos de edição com os detalhes do carro
          this.marcaParaAtualizar = carro.marca;
          this.modeloParaAtualizar = carro.modelo;
        },
        (error) => {
          console.error('Erro ao buscar detalhes do carro', error);
        }
      );
    }
  }

  mostrarFormularioNovoCarro() {
    this.exibirFormularioNovoCarro = true;
  }

  criarNovoCarro() {
    const carroData = {
      marca: this.novaMarca,
      modelo: this.novoModelo,
    };

    this.AdminTools.postCarro(carroData).subscribe(
      (resposta) => {
        alert('Carro adicionado com sucesso.');
      },
      (error) => {
        console.error('Erro ao adicionar o carro:', error);
        alert('Erro ao adicionar o carro.');
      }
    );
  }
}
