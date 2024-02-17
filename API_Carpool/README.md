# Raging-Frogs-Battle-Against-Typescript_Carpool

Rui Silva - Filipe Calça - Bernardo Dias - Aija Repsa - Tiago Silva

# Descrição

Este projeto é uma aplicação de carpooling que facilita o compartilhamento de viagens entre os utilizadores. A aplicação utiliza TypeScript para o desenvolvimento do backend e depende de uma combinação de bancos de dados MongoDB e SQL. O uso de middleware, JSON Web Tokens (JWT) para autorização de utilizadores, listagem negra de tokens e várias funcionalidades relacionadas com os utilizadores aprimora a segurança e funcionalidade da API.

## Variáveis de Ambiente

São utilizadas as seguintes variáveis de ambiente:

- `DB_SERVER`: servidor MongoDB.
- `DB_NAME`: nome da base de dados MongoDB.
- `POSTGRE_URL`: URL de conexão com base de dados PostgreSQL.
- `SECRET_KEY`: Chave secreta para geração de tokens JWT.

## Rotas de Usuário

- **GET - Obter próprio perfil do usuário pelo token**

  - **Rota:** `/api/user/byToken`

- **GET - Obter usuário por ID**

  - **Rota:** `/api/user/:id`

- **POST - Registrar usuário**

  - **Rota:** `/api/user/registo`

- **POST - Login usuário**

  - **Rota:** `/api/user/login`

- **POST - Logout usuário**
  - **Rota:** `/api/user/logout`
- **PATCH - Alterar rating do usuário**

  - **Rota:** `/api/user/rating`

- **PATCH - Editar própria senha**

  - **Rota:** `/api/user/change-password`

- **PATCH - Editar tipo e estado ativo/inativo de um usuário (pelo e-mail)**

  - **Rota:** `/api/user/editar/:email`

- **PATCH - Delete lógico para o próprio user (by token)**

  - **Rota:** `/api/user/forget`

- **GET - Obter todos os usuários (para fins de teste)**
  - **Rota:** `/api/user/`
- **DELETE - Eliminar usuário por ID (para fins de teste)**
  - **Rota:** `/api/user/:id`

## Rotas de oferta da boleia

- **POST - Criar ofertaBoleia**

  - **Rota:** `/api/ofertaBoleia`

- **PATCH - Cancelar ofertaBoleia**

  - **Rota:** `/api/ofertaBoleia/cancelar/:id`
    Recebe id da ofertaBoleia e extrai id do utilizador do token -> verifica se ofertaBoleia existe e se o uitlizador é condutor -> marca ofertaBoleia como cancelada -> cancela todas boleias associadas -> adiciona rating 0 ao condutor por cada passageiro.

- **GET - Ofertas pendentes do utilizador**

  - **Rota:** `/api/ofertaBoleia/pendentes`

- **GET - Ofertas terminadas do utilizador**

  - **Rota:** `/api/ofertaBoleia/terminadas`

- **GET - Ofertas por municípios**

  - **Rota:** `/api/ofertaBoleia/local`

- **GET - Todas as ofertasBoleia atuais**

  - **Rota:** `/api/ofertaBoleia/todas`

- **PATCH - Reduzir lugares da ofertaBoleia**

  - **Rota:** `/api/ofertaBoleia/reduzirLugares/:id`

- **PATCH - Aumentar lugares (boleia cancelada)**
  - **Rota:** `/api/ofertaBoleia/aumentarLugares/:id`

## Rotas de candidatura

- **POST - Criar candidatura**

  - **Rota:** `/api/candidatura`

- **GET - Buscar candidaturas pendentes e rejeitadas dum utilizador (pelo token)**

  - **Rota:** `/api/candidatura/minhasCandidaturas`

- **GET - Buscar candidaturas pendentes para um condutor (pelo token)**

  - **Rota:** `/api/candidatura/paraCondutor`

- **PATCH - Mudar o status da candidatura**

  - **Rota:** `/api/candidatura/:id`

- **PATCH - Cancelar candidatura**

  - **Rota:** `/api/candidatura/cancelar/:id`

- **sem rota - mudar todas as candidaturas pendentes duma ofertaBoleia para rejeitadas**
  - **Método** `changePendingToRejected(ofertaBoleiaId, res)`

## Rotas de boleia

- **POST - Criar uma boleia**

  - **Rota:** `/api/boleia`

- **GET - Ler boleias por terminar**

  - **Rota:** `/api/boleia/nao/terminado`

- **GET - Ler boleias por utilizador**

  - **Rota:** `/api/boleia`

- **GET - Ler boleias por avaliar e que estão terminadas**

  - **Rota:** `/api/boleia/nao/avaliada`

- **PATCH - Avaliar uma boleia**

  - **Rota:** `/api/boleia/:_id/avaliar`
    Recebe id de boleia nos párabmetros, avaliação no "body" e extrai id do utilizador do token
    -> verifica se a boleia está terminada -> se utilizador for passageiro, muda avaliação do condutor e vice versa -> muda o rating do utilizador avaliado.

- **PATCH - Terminar uma boleia**

  - **Rota:** `/api/boleia/:_id/terminar`

- **GET - Obter boleias do utilizador**
  - **Rota:** `/api/boleia/minhasBoleias`
