import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LandingComponent } from './landing/landing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BoleiasComponent } from './boleias/criarOfertaBoleias/ofertaBoleias.component';
import { RegistoComponent } from './modals/registo/registo.component';
import { LoginComponent } from './modals/login/login.component';
import { VerBoleiasComponent } from './boleias/verBoleias/ver-boleias.component';
import { PerfilUtilizadorComponent } from './perfil-utilizador/perfil-utilizador.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PerfilUtilizadorService } from 'src/Servicos/PerfilServicos/Dashboard/perfil-utilizador.service';
import { AdminToolsComponent } from './admin-tools/admin-tools.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { VerTodasOfertasComponent } from './boleias/ver-todas-ofertas/ver-todas-ofertas.component';

@NgModule({
  declarations: [
    AppComponent,
    LandingComponent,
    BoleiasComponent,
    RegistoComponent,
    LoginComponent,
    VerBoleiasComponent,
    PerfilUtilizadorComponent,
    DashboardComponent,
    AdminToolsComponent,
    PageNotFoundComponent,
    VerTodasOfertasComponent,
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [PerfilUtilizadorService],
  bootstrap: [AppComponent],
})
export class AppModule {}
