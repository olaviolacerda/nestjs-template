> ⚠️ This template is not ready yet.

<p>Pending tasks:</p>
<ul>
  <li>E2E testing</li>
  <li>Folder structure (refactor)</li>
  <li>Logging</li>
</ul>

<h1 align="center">Welcome to nest-typescript-template 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
  <img alt="Node Version" src="https://img.shields.io/badge/node-18.x-blue.svg" />
  <a href="#" target="_blank">
    <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg" />
  </a>
  <a href='https://coveralls.io/github/olaviolacerda/nestjs-template?branch=main'>
    <img alt='Coverage Status' src='https://coveralls.io/repos/github/olaviolacerda/nestjs-template/badge.svg?branch=main&kill_cache=1' />
  </a>
</p>

> Cloned from Nest TypeScript starter repository and updated.

### ✨ [Demo](https://nestjs-template-seven.vercel.app/)

## Prerequisites

- node 18.x

## Install

```sh
npm install
```

## Start your Database

1. Run the `docker-compose` file. It will run a Postgres container so you may use to develop and test locally.

```sh
docker-compose up -d
```

2. Run the migrations to create the initial `users` table.

```sh
npm run migration:run
```

## Usage

```sh
npm run start:dev
```

## Run unit tests

```sh
npm run test
```

## Run e2e tests

```sh
npm run test:e2e
```

> Please refer to `package.json` for more scripts to run.

## Author

👤 **Olavio Lacerda**

- Website: https://www.olavio.dev
- Github: [@olaviolacerda](https://github.com/olaviolacerda)
- LinkedIn: [@olavio-lacerda](https://linkedin.com/in/olavio-lacerda)

## Show your support

Give a ⭐️ if this project helped you!

## Useful resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM Documentation](https://typeorm.io/)
- [A Step-by-Step Guide to Implement JWT Authentication in NestJS using Passport](https://medium.com/@camillef_58366/implementing-authentication-in-nestjs-using-passport-and-jwt-5a565aa521de)
- [NestJS Unit Testing](https://www.tomray.dev/nestjs-unit-testing)
- [Testing in NestJS](https://dev.to/chafroudtarek/testing-in-nestjs-a-comprehensive-guide-3hjo)
- [Advanced Testing in NestJS](https://trilon.io/blog/advanced-testing-strategies-with-mocks-in-nestjs)
- [Testing NestJS Repo](https://github.com/jmcdo29/testing-nestjs/tree/main)

---

_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
