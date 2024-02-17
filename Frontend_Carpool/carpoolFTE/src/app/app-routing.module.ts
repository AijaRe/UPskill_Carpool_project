import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { authGuard } from './guard/auth.guard';

import { RegistoComponent } from './modals/registo/registo.component';
import { BoleiasComponent } from './boleias/criarOfertaBoleias/ofertaBoleias.component';
import { VerBoleiasComponent } from './boleias/verBoleias/ver-boleias.component';
import { PerfilUtilizadorComponent } from './perfil-utilizador/perfil-utilizador.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AdminToolsComponent } from './admin-tools/admin-tools.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { VerTodasOfertasComponent } from './boleias/ver-todas-ofertas/ver-todas-ofertas.component';

const routes: Routes = [
  {
    path: '',
    component: LandingComponent,
  },
  {
    path: 'perfil',
    component: PerfilUtilizadorComponent,
    canActivate: [authGuard],
  },
  {
    path: 'registo',
    component: RegistoComponent,
  },
  {
    path: 'criarBoleias',
    component: BoleiasComponent,
  },
  {
    path: 'verBoleias',
    component: VerBoleiasComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'admin-tools',
    component: AdminToolsComponent,
    canActivate: [authGuard],
  },
  {
    path: 'todasOfertas',
    component: VerTodasOfertasComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
