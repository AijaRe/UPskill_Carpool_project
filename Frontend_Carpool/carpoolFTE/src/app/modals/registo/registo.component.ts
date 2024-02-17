import { Component, Output,EventEmitter } from '@angular/core';
import { RegistoService } from 'src/Servicos/registo/registo.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registo',
  templateUrl: './registo.component.html',
  styleUrls: ['./registo.component.css'],
})
export class RegistoComponent {

  @Output() registoComSucesso = new EventEmitter<void>();

  formData = {
    nome: '',
    email: '',
    telefone: '',
    password: '',
    termosAceites: false,
  };

  errosValidacaoFormulario: {
    nome?: string;
    email?: string;
    password?: string;
    telefone?: string;
  } = {};
  showTermsModal = false;

  constructor(private registoService: RegistoService, private router: Router) {}

  private validateForm(): boolean {
    let valido = true;
    const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    const TELEFONEREGEX = /^9\d{8}$/;

    if (!this.formData.nome) {
      this.errosValidacaoFormulario['nome'] = 'Nome é obrigatório.';
      valido = false;
    }

    if (!this.formData.telefone) {
      this.errosValidacaoFormulario['telefone'] = 'Telefone é obrigatório.';
    } else if (!TELEFONEREGEX.test(this.formData.telefone)) {
      this.errosValidacaoFormulario['telefone'] = 'Telefone inválido';
    }

    if (!this.formData.password) {
      this.errosValidacaoFormulario['password'] = 'Password é obrigatória.';
      valido = false;
    } else if (!PASSWORD_REGEX.test(this.formData.password)) {
      this.errosValidacaoFormulario['password'] =
        'Password tem de conter no mínimo 8 caracteres, uma maiúscula, uma minúscula e um número';
    }

    if (!this.formData.email) {
      this.errosValidacaoFormulario['email'] = 'Email é obrigatório.';
      valido = false;
    } else if (!EMAIL_REGEX.test(this.formData.email)) {
      this.errosValidacaoFormulario['email'] = 'Email inválido.';
      valido = false;
    }

    return valido;
  }

  onSubmit() {
    if (this.formData.termosAceites) {
      if (this.validateForm()) {
        // Chama o serviço para fazer o post do Registo
        this.registoService.registoCarpool(this.formData).subscribe(
          (response) => {
            alert(
              'Foi registado com sucesso, já pode fazer login'
            );
            console.log(response);
            // Navegar para o login
            this.router.navigate(['']);
          },
          (error) => {
            console.error(error);
            alert('Houve um problema no seu registo');
          }
        );
      }
    } else {
      alert('Por favor, aceite os termos e condições para continuar.');
    }
  }

  onAccept(): void {
    this.formData.termosAceites = true;
    this.closeTermsModal();
  }

  openTermsAndConditionsModal(): void {
    this.showTermsModal = true;
  }

  closeTermsModal(): void {
    this.showTermsModal = false;
  }
}
