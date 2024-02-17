import { Component } from '@angular/core';
import { LoginService } from 'src/Servicos/Login/login.service';
import { TokenService } from 'src/Servicos/token/token.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  modalVisible = false;
  email: string = '';
  password: string = '';
  errorMessage: string = '';
  userEmail!: string;
  constructor(
    private authService: LoginService,
    private tokenService: TokenService,
    private router: Router
  ) {}

  // Método para realizar logout: remove o token do usuário e redireciona para a página inicial
  logout(): void {
    this.tokenService.logout().subscribe(
      (response) => {
        this.tokenService.removeToken();
        this.router.navigate(['/']);
      },
      (error) => {
        console.error('Logout falhou:', error);
      }
    );
  }

  isAuthenticated(): boolean {
    return this.tokenService.isLoggedIn();
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  // check if token exists and is not expired
  isLoggedIn(): boolean {
    return this.tokenService.isLoggedIn();
  }
  //Abrir o modal do login
  openLoginModal(): void {
    this.modalVisible = true;
  }
  //Fechar o modal do login
  closeLoginModal(): void {
    this.modalVisible = false;
  }

  isAdmin(): boolean {
    return this.tokenService.isAdmin();
  }

  //Lógica para realizar o login
  login(formData: { email: string; password: string }): void {
    // Realizar autenticação usando formData.email e formData.password
    this.authService.loginCarpool(formData.email, formData.password).subscribe(
      (response) => {
        // Token e informações do utilizador recebidos
        console.log('Token e Informações do Utilizador Recebidos:', response);

        // Utilizar o seu TokenService para definir o token e as informações do utilizador
        localStorage.setItem('token', response.userToken);
        console.log(response.userToken);
        alert('Login efetuado com sucesso!');
        // Ação para fechar o modal
        this.closeLoginModal();
      },
      (error) => {
        // Registar erro na consola
        console.error('Erro durante o login:', error);
        // Alertar o utilizador sobre problemas de autenticação
        alert('Houve um problema na sua autenticação, tente novamente.');
      }
    );
  }
}
