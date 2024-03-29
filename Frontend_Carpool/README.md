Rui Silva - Filipe Calça - Bernardo Dias - Aija Repsa - Tiago Silva

# CarpoolFTE - Plataforma de Partilha de Viagens

## Descrição do Projeto

O CarpoolFTE é uma aplicação frontend destinada à partilha de viagens. Utiliza a API pública [GeoAPI](https://docs.geoapi.pt/), que disponibiliza informações relacionadas com locais, tais como distritos, concelhos e freguesias. O sistema é suportado por dois backends:

1. **Carpool_BE:** Desenvolvido em Node, este backend gere informações relativas a clientes, deslocações e boleias.
2. **Carros_BE:** Também desenvolvido em Node, este backend trata da gestão de informações acerca de marcas e modelos de carros.

## Funcionalidades

Os utilizadores podem realizar as seguintes ações:

- Registar-se e fazer login na plataforma.
- Publicar ofertas de partilha de viagens.
- Procurar por partilhas de viagens de uma freguesia específica para outra, numa data específica, ou visualizar todas as partilhas disponíveis.
- Candidatar-se a um lugar numa partilha de viagem, sendo que o condutor pode aceitar ou rejeitar a candidatura.
- Caso a candidatura seja aceite, esta transforma-se num evento de partilha de viagem, permitindo aos utilizadores avaliarem-se mutuamente.

## Segurança e Acesso

O projeto implementa autenticação de utilizadores através de tokens e utiliza guardas de rota funcionais. Existem diferentes partes da aplicação visíveis para utilizadores não registados, utilizadores registados e administradores.

## Tecnologia Utilizada

Este projeto foi gerado com [Angular CLI](https://github.com/angular/angular-cli) na versão 16.2.10.

## Servidor de Desenvolvimento

Execute `ng serve` para iniciar o servidor de desenvolvimento. Navegue até `http://localhost:4200/`. A aplicação será recarregada automaticamente se houver alterações nos ficheiros de origem.

O projeto possui ambientes de teste e produção. Caso seja necessário, altere a URL das APIs externas em `src/environments`.

---

Vai ser uma viagem incrível nesta plataforma de carpooling! Registe-se, publique a sua oferta de viagem e aproveite a companhia agradável dos seus novos colegas de viagem. Boas viagens! 🚗💨
