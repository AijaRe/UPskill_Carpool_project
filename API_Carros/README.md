Rui Silva - Filipe Calça - Bernardo Dias - Aija Repsa - Tiago Silva

# Raging-Frogs-Battle-Against-Typescript_Carros

Esta documentação descreve as rotas disponíveis na API de Carros, que é parte integrante do sistema CarpoolFTE. A API implementa um middleware de verificação de token (`verifyToken`) que garante o acesso seguro às rotas específicas, dependendo do perfil do utilizador.

## Variáveis de Ambiente

São utilizadas as seguintes variáveis de ambiente:

- `DB_SERVER`: servidor MongoDB.
- `DB_NAME`: nome da base de dados MongoDB.
- `SECRET_KEY`: Chave secreta para geração de tokens JWT.

## Rotas Disponíveis

### GET Obter Todos os Carros
- **Rota:** `/`

### GET Obter Todas as Marcas de Carros
- **Rota:** `/marcas`

### GET Obter Modelos de uma Marca Específica
- **Rota:** `/marca/:marca`

### GET Obter um Carro pelo seu ID
- **Rota:** `/id/:_id`

### GET Obter um Carro Específico por Marca e Modelo
- **Rota:** `/carro/:marca/:modelo`

### PUT Atualizar um Carro Específico por Marca e Modelo
- **Rota:** `/:marca/:modelo`

### POST Criar um Novo Carro
- **Rota:** `/`


