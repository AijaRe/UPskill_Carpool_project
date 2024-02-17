import { Component, OnInit } from '@angular/core';
import { EdicaoUtilizadorService } from 'src/Servicos/PerfilServicos/PaginaPerfil/edicao-utilizador.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TokenService } from 'src/Servicos/token/token.service';
import { OfertaBoleiasService } from 'src/Servicos/boleias/criarOfertasBoleia/oferta-boleias.service';

@Component({
  selector: 'app-perfil-utilizador',
  templateUrl: './perfil-utilizador.component.html',
  styleUrls: ['./perfil-utilizador.component.css'],
})
export class PerfilUtilizadorComponent implements OnInit {
  perfilUtilizador: any;
  passwordForm: FormGroup;
  showPasswordFields: boolean = false;
  ofertaBoleiasPassadas: any[] = [];
  edicaoPerfil!: FormGroup;
  listaCarros!: any[];

  constructor(
    private edicaoUtilizadorService: EdicaoUtilizadorService,
    private formulario: FormBuilder,
    private router: Router,
    private tokenService: TokenService,
    private ofertaBoleia: OfertaBoleiasService
  ) {
    this.passwordForm = this.formulario.group({
      CurrentPassword: ['', Validators.required],
      NewPassword: ['', Validators.required],
      NewPasswordConfirm: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    // Call the getUtilizador() method when the component is initialized
    this.obterUtilizador();
    this.carregarOfertasBoleiaTerminadas();
    this.CarregarCarros();
  }

  togglePasswordFields(): void {
    this.showPasswordFields = !this.showPasswordFields;
    this.carregarOfertasBoleiaTerminadas();
  }

  obterUtilizador(): void {
    this.edicaoUtilizadorService.getUtilizador().subscribe(
      (response: any) => {
        // Explicitly define the type of 'response' as 'any'
        console.log('Dados do utilizador:', response);

        // Check if 'data' property exists in the response object
        if (response && response.data) {
          this.perfilUtilizador = response.data;
        } else {
          console.error('Falta de dados na resposta:', response);
        }
      },
      (error) => {
        console.error('Erro a obter dados do utilizador:', error);
      }
    );
  }

  checkPasswordMatch(): boolean {
    const newPassword = this.passwordForm.get('NewPassword')?.value;
    const newPasswordConfirm =
      this.passwordForm.get('NewPasswordConfirm')?.value;
    return newPassword === newPasswordConfirm;
  }

  changePassword(): void {
    if (this.passwordForm.valid && this.checkPasswordMatch()) {
      const updatedData = {
        currentPassword: this.passwordForm.get('CurrentPassword')?.value,
        newPassword: this.passwordForm.get('NewPassword')?.value,
      };
      this.edicaoUtilizadorService.atualizarPassword(updatedData).subscribe(
        (data) => {
          alert('Password atualizada com sucesso.');
          this.router.navigate(['perfil']);
        },
        (error) => {
          if (error.status === 400) {
            console.log(
              'Invalid current password or new password match failure.'
            , error);
          } else {
            console.log('Error changing password.', error);
          }
        }
      );
    }
  }

  deleteProfile(): void {
    this.edicaoUtilizadorService.esquecerUtilizador().subscribe(
      () => {
        alert('Perfil apagado permanentemente com sucesso.');
        this.tokenService.removeToken();
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Erro ao apagar perfil:', error);
        alert('Erro ao apagar perfil. Por favor, tente novamente.');
      }
    );
  }

  CarregarCarros() {
    this.ofertaBoleia.getCarros().subscribe(
      (listaCarros: any[]) => {
        if (listaCarros && listaCarros.length > 0) {
          this.listaCarros = listaCarros;
          console.log('Lista de carros carregada: ', this.listaCarros);
          // Call the function to load offers after loading the car list
          this.carregarOfertasBoleiaTerminadas();
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

  carregarOfertasBoleiaTerminadas(): void {
    this.edicaoUtilizadorService.getBoleiasPassadas().subscribe(
      (response: any) => {
        if (response && response.data && Array.isArray(response.data)) {
          this.ofertaBoleiasPassadas = response.data;

          // Mapa das ofertaBoleiasPassadas com listaCarros baseado no id
          this.ofertaBoleiasPassadas.forEach((boleia) => {
            // Find the corresponding car object in listaCarros based on _id
            const correspondingCar = this.listaCarros.find(
              (carro) => carro._id === boleia.carro
            );

            // Log the mapping
            console.log(
              `Ride offer ID: ${boleia.id} - Corresponding Car:`,
              correspondingCar
            );

            // If a corresponding car is found, add it to boleia
            if (correspondingCar) {
              boleia.carroObject = correspondingCar;
            }
          });

          console.log(
            'Ofertas de boleia terminadas: ',
            this.ofertaBoleiasPassadas
          );
        } else {
          console.error('Resposta inválida do servidor:', response);
        }
      },
      (error) => {
        console.error('Erro ao buscar ofertas de boleia terminadas: ', error);
        if (error.error && error.error.erro) {
          console.error('Mensagem de erro do servidor:', error.error.erro);
        }
      }
    );
  }
}
