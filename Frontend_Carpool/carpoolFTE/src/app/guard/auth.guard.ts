import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { TokenService } from 'src/Servicos/token/token.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const tokenService = inject(TokenService);
  const routePath = route.routeConfig?.path;

  if (
    (routePath === 'dashboard' ||
      routePath === 'verBoleias' ||
      routePath === 'criarBoleias' ||
      routePath === 'perfil') &&
    tokenService.isLoggedIn()
  ) {
    return true;
  }

  if (routePath === 'admin-tools' && tokenService.isAdmin()) {
    return true;
  }

  console.warn('Acesso não autorizado. Redirecionando para a página inicial.');
  // Navigate to the landing page
  router.navigate(['/']);
  return false;
};
