# Cocos Code Challenge Backend

Este repositorio tiene el codigo del challenge para la posicion de **Backend** en CocosCapital: [Link del challenge](https://github.com/cocos-capital/cocos-challenge/blob/main/backend-challenge.md)

El enfoque del desarrollo lo hice en base a las tecnologias con las que estoy trabajando actualmente. Ademas de seguir experimentando con algunas cosas como estructura de carpetas, organizacion de archivos, nomenclatura, etc.

Para la base de datos opte por levantar una db postgres en un docker-compose y trabaja alli, y con las migraciones cargue los mismos datos provistos por el challenge. De todas formas conectandose a la db provista, funciona.

A nivel organizacion de repositorio, no quise descuidar el uso de Git y Git Flow por lo que existe una rama principal `main` que seria el entorno productivo, la rama `develop` que es el entorno de desarrollo y pruebas y luego trabajar con diferentes `branches` para cada feature, bugfix, etc. Tambien simule como si estuviera resolviendo tickets reales y por eso inclui en el nombre de las ramas y en los commits un ticket ficticio "`CCB-`" (Cocos Challenge Backend).

## Tecnologias

- NodeJS
- TypeScript
- NestJS
- TypeORM
- PostgreSQL
- Docker Compose
- Jest

## Instalacion

1. Clonar el repositorio

```bash
git clone https://github.com/GermanTorales/cocos-challenge-backend
```

2. Instalar dependencias

```bash
npm install
```

3. Cargar variables de entorno

```bash
cp .env.example .env
```

4. Levantar la basde de datos (**opcional**)

```bash
docker-compose -f ./local.docker-compose.yml
```

5. Ejecutar migraciones (**opcional**)

```bash
npm run migration:run
```

## Requerimientos

Desarrollar una API que permita obtener la siguiente información a traves de endpoints:

- [x] **Portfolio**: La respuesta deberá devolver el valor total de la cuenta de un usuario, sus pesos disponibles para operar y el listado de activos que posee (incluyendo cantidad de acciones, el valor total monetario de la posición ($) y el rendimiento total (%)).

- [x] **Buscar activos**: La respuesta deberá devolver el listado de activos similares a la busqueda realizada (tiene que soportar busqueda por ticker y/o por nombre).

- [x] **Enviar una orden al mercado**: A traves de este endpoint se podrá enviar una orden de compra o venta del activo. Soportando dos tipos de ordenes: MARKET y LIMIT. Las ordenes MARKET no requieren que se envíe el precio ya que se ejecutara la orden con las ofertas del mercado, por el contrario, las ordenes limite requieren el envío del precio al cual el usuario quiere ejecutar la orden. La orden quedará grabada en la tabla orders con el estado y valores correspondientes.

## Test

Los test para este challenge solo se implementaron para la logia de **creacion de ordenes**. El coverage conseguido es de poco mas del **80%**.

Ejecutar tests

```bash
npm run test
```

Ejecutar coverage

```bash
npm run test:cov
```

## Codigo

- [x] Versionamiento en la API.
- [x] Clean Architecture.
- [x] Logs de la API con Morgan.
- [x] Validaciones de variables de entorno.
- [x] Documentacion de la API con Swagger.
- [x] Sistema de excepciones.

## Organizacion de carpetas

```
|--src\
    |--common\                      # Archivos de uso comun en el server.
    |--config\                      # Configuraciones de distintas dependencias.
    |--modules\                     # Modulos de la aplicacion.
        |--module-name
            |--controllers          # Controllers versionados del modulo.
            |--dtos                 # Data Transfer Objects interfaces.
            |--entity               # Entidad de base de datos del modulo.
            |--presentations        # Clases que representan a las respuestas de los endpoints.
            |--repository           # Comunicacion con base de datos.
            |--use-cases            # Logica de negocio.
            |--module.ts            # Modulo.

    |--app.module.ts                # Modulo principal.
    |--man.ts                       # Archivo root.
```

## Documentacion

Existe un swagger al que se puede acceder para ver la documentacion de los endpoints.

```bash
http://localhost:3131/api-docs
```

Ademas, en el repositorio, se inluyeron los archivos JSON para importar la coleccion en **Postman**.
