import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OfertaBoleiasService } from 'src/Servicos/boleias/criarOfertasBoleia/oferta-boleias.service';
import { GeoApiService } from 'src/Servicos/GeoApi/geo-api.service';
import { Router } from '@angular/router';
import { TokenService } from 'src/Servicos/token/token.service';
@Component({
  selector: 'app-boleias',
  templateUrl: './ofertaBoleias.component.html',
  styleUrls: ['./ofertaBoleias.component.css'],
})
export class BoleiasComponent implements OnInit {
  listaCarros!: any[];
  ofertaBoleiaForm!: FormGroup;
  municipiosFreguesias!: any[];
  municipioEscolhidoOrigem!: string;
  municipioEscolhidoDestino!: string;
  freguesiaEscolhidaOrigem: string = '';
  freguesiaEscolhidaDestino: string = '';
  freguesiasOrigem: string[] = [];
  freguesiasDestino: string[] = [];
  modelosCarro: string[] = [];
  carroEscolhido: any;

  constructor(
    private ofertaBoleia: OfertaBoleiasService,
    private fb: FormBuilder,
    private geoService: GeoApiService,
    private router: Router,
    private tokenService:TokenService
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.CarregarCarros();
    this.CarregarFreguesiasMunicipios();
  }

  onSubmit() {
    if (this.ofertaBoleiaForm.valid) {
      const infoBoleia = this.ofertaBoleiaForm.value;

      // Aceder ao objectID do carroEscolhido
      const carroEscolhidoObjectID = this.carroEscolhido?._id;

      // Include the selected car's ObjectID in your request payload
      infoBoleia.carro = carroEscolhidoObjectID;

      console.log('Form Data:', infoBoleia);

      this.ofertaBoleia.criarOfertaBoleia(infoBoleia).subscribe(
        (response) => {
          console.log('POST bem sucedido: ', response);
          alert('Foi criada uma boleia! A carpool deseja-lhe uma boa viagem.');
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          console.error('Erro a realizar o post devido ao seguinte: ', error);
        }
      );
    } else {
      console.log('Form is invalid. Please check the fields.');
      alert(
        'Verifique o preenchimento do formulário, pode haver um campo em falta ou mal preenchido.'
      );
    }
  }

  initializeForm() {
    this.ofertaBoleiaForm = this.fb.group({
      carro: [null, Validators.required],
      matricula: ['', Validators.required],
      cor: ['', Validators.required],
      partidaMunicipio: ['', Validators.required],
      partidaFreguesia: ['', Validators.required],
      destinoMunicipio: ['', Validators.required],
      destinoFreguesia: ['', Validators.required],
      data: ['', Validators.required],
      lugares: ['', Validators.required],
    });
  }

  CarregarCarros() {
    this.ofertaBoleia.getCarros().subscribe(
      (listaCarros: any[]) => {
        this.listaCarros = listaCarros;
        console.log('lista: ', listaCarros);
      },
      (error) => {
        console.error('Erro ao buscar os carros', error);

        if (error.error && error.error.erro) {
          console.error('Mensagem de erro do servidor: ', error.error.erro);
        }
      }
    );
  }

  modeloParaMarca() {
    // Get selected marca
    const selectedMarca = this.ofertaBoleiaForm.get('marcaCarro')?.value;

    // Filter modelos based on selected marca
    if (selectedMarca) {
      const modelos = this.listaCarros
        .filter((carro) => carro.marca === selectedMarca)
        .map((carro) => carro.modelo);

      // Update modelos dropdown
      this.modelosCarro = modelos;
    } else {
      this.modelosCarro = [];
    }
  }

  CarregarFreguesiasMunicipios() {
    this.geoService.getMunicipiosFreguesias().subscribe(
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

  isLoggedin(): boolean {
  
    return this.tokenService.isLoggedIn();
  }

  enviarParaRegisto(): void {
    alert("Ainda não tens conta criada, regista-te para começar a viajar e a poupar!")
    this.router.navigate(['/registo']); 
  }


  freguesiaParaMunicipioOrigem() {
    // Selecionar o municipio
    const municipioEscolhidoOrigem = this.municipiosFreguesias.find(
      (municipio) => municipio.nome === this.municipioEscolhidoOrigem
    );
    console.log(municipioEscolhidoOrigem);

    // Verificação
    if (municipioEscolhidoOrigem) {
      // Retirar as freguesias do municipio escolhido
      const freguesiasOrigem = municipioEscolhidoOrigem.freguesias;
      console.log(freguesiasOrigem);
      // Fazer update ao dropdown
      this.freguesiasOrigem = freguesiasOrigem;
    } else {
      this.freguesiasOrigem = [];
    }
  }

  freguesiaParaMunicipioDestino() {
    // Selecionar o municipio
    const municipioEscolhidoDestino = this.municipiosFreguesias.find(
      (municipio) => municipio.nome === this.municipioEscolhidoDestino
    );

    // Verificação
    if (municipioEscolhidoDestino) {
      // Retirar as freguesias do municipio escolhido
      const freguesiasDestino = municipioEscolhidoDestino.freguesias;

      // Fazer update ao dropdown
      this.freguesiasDestino = freguesiasDestino;
    } else {
      this.freguesiasDestino = [];
    }
  }
}
