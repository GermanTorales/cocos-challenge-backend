# Cocos Code Challenge Backend

Este repositorio tiene el codigo del challenge para la posicion de **Backend** en CocosCapital: [Link del challenge](https://github.com/cocos-capital/cocos-challenge/blob/main/backend-challenge.md)

## Tecnologias

- NodeJS
- TypeScript
- NestJS
- TypeORM
- PostgreSQL
- Docker Compose

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

- [ ] **Enviar una orden al mercado**: A traves de este endpoint se podrá enviar una orden de compra o venta del activo. Soportando dos tipos de ordenes: MARKET y LIMIT. Las ordenes MARKET no requieren que se envíe el precio ya que se ejecutara la orden con las ofertas del mercado, por el contrario, las ordenes limite requieren el envío del precio al cual el usuario quiere ejecutar la orden. La orden quedará grabada en la tabla orders con el estado y valores correspondientes.
