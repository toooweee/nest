<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

 
## Description

[Nest](https://github.com/nestjs/nest) framework.

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

# Providers 

`Provider` - это фундаментальный строительный блок NestJS. Чаще всего - это обычный класс, помеченный декоратором `@Injectable`. Но как мы увидим дальше, провайдером может быть не только класс.

Основная задача провайдеров - инкапсулировать какую-то логику, будь то бизнес-правила, доступ к базе данных, вызов внешних API и т.д. Но самое главное - они являются основными элементами, которыми управляет система `внедрения зависимостей` (Dependency Injection) NestJS

DI простыми словами: Вместо того чтобы класс сам создавал нужные ему другие классы (свои зависимости), он просто объявляет, что ему нужно, а контейнер NestJS (IoC-контейнер) сам находит или создает нужные экземпляры (провайдеры) и "внедряет" их в нужный класс (обычно через конструктор).

Польза DI:
- `Слабая связность` (Loose Coupling): Классы не зависят жестко от конкретных реализаций своих зависимостей. Легче менять компоненты
- `Тестируемость`: Легко подменить реальные зависимости на "моки" (заглушки) во время тестов.
- `Переиспользование`: Хорошо спроектированные сервисы можно легко использовать в разных частях приложения
- `Централизованное управление`: NestJS управляет созданием и жизненным циклом объектов

### Кастомные провайдеры

Стандартный механизм (providers: [MyService]) прост, но не всегда достаточен. Кастомные провайдеры нужны, когда стандартной регистрации класса недостаточно, например:
- Нужно внедрить не класс, а готовое значение (строку, число, объект конфигурации, экземпляр внешней библиотеки)
- Процесс создания экземпляра класса сложный, требует других зависимостей или асинхронных операций (Например, подключение к БД)
- Нужно использовать один и тот же экземпляр под разными идентификаторами (Алиасы)
- Нужно подменить реализацию на лету, например использовать один класс в разработке, другой в проде или тестах

#### Как юзать:
Вместо имени класса в массиве провайдеров ты указываешь объект со специальными свойствами: 
- `provide`: Токен(Ключ/Идентификатор). Это самое важное свойство. Оно определяет, по какому имени ты будешь запрашивать эту зависимость. Может быть:
  1. Имя класса (UsersService)
  2. Строка ("API_KEY", "DATABASE_URL")
  3. Символ (Symbol('MyUniqueToken'))
- Одно из `use*`: Определяет, как NestJS предоставит значение этого токена

#### Разновидности Кастомных провайдеров (use*)
- `useValue`:
  - Как: `providers: [{ provide: "TOKEN", useValue: "Готовое значение"}]`
  - Зачем: Для внедрения уже существующих значений: Констант (API ключи, строки конфигурации), заранее созданных объектов, экземпляров внешних библиотек, моков для тестов. `NestJS ничего не создает, а просто возвращает то, что ты указал в useValue`
  - Пример: Внедрение строки API ключа
    ```typescript
    // app.module.ts
    @Module({
    providers: [
      AppService, 
      { 
        provide: "API_KEY",
        useValue: "my-super-secret-api-key-123"
      }
    ],
    })
    export class AppModule {}
    // app.service.ts
    
    import { Injectable, Inject } from '@nestjs/common'
    @Injectable()
    export class AppService {
      constructor(@Inject("API_KEY") private readonly apiKey: string) {
      console.log(`AppService received API KEY: ${this.apiKey}`)
      }
    }
    ```
- `useClass`:
  - Как: `providers: [{ provide: BaseClassOrToken, useClass: ConcreteClass}]`
  - Зачем: Когда нужно, чтобы при запросе по токену BaseClassOrToken (Это может быть абстрактный класс или другой токен) NestJS создал и вернул экземпляр другого конкретного класса ConcreteClass. Используется для подмены реализаций или предоставления конкретной реализации для абстракции.
  - Пример: разные логгеры:
  ```typescript
  // logger.interfaces.ts
  export abstract class Logger {
    abstract log(msg: string): void
  }
  
  // console-logger.service.ts
  @Injectable()
  export class ConsoleLogger extends Logger {
    log(msg: string) {
      console.log(`[CONSOLE]: ${msg}`)
    }
  }
  // file-logger.service.ts
  
  @Injectable()
  export class FileLogger extends Logger {
    log(msg: string) {
      console.log(`[FILE]: ${msg}`)
    }
  }
  
  // app.module.ts
  @Module({
    providers: [
      ConsoleLogger, FileLogger, 
      {
        provide: Logger, // Токен - абстрактный класс
        // Указываем какой класс использовать при запросе Logger
        useClass: process.env.NODE_ENV === 'production' ? FileLogger : ConsoleLogger,
      }
    ],
  })
  export class AppModule {}
  
  // app.service.ts
  @Injectable()
  export class AppService {
    constructor(private readonly logger: Logger ) {
      this.logger.log('AppService started')
      // Получит FileLogger в production, ConsoleLogger иначе
    }
  }
  ```
- `useFactory`:
  - Как: `providers: [{ provide: "TOKEN", useFactory: (dep1, dep2) => { /* логика */ return instance }, inject: [Dep1Service, 'DEP2_TOKEN'] }]`  
  - Зачем: самый гибкий и мощный способ, Нужен, когда создание экземпляра требует:
    - `Зависимостей`: Фабрика может получать другие провайдеры (через `inject`)
    - `Сложной логики`: Вычисления, условия и т.д.
    - `Асинхронных операций`: async/await для подключения к БД, загрузки конфигов и т.д. NestJS дождется выполнения `promise`
  - Пример: Создание подключения к БД с использованием ConfigService:
  ```typescript
  // database.module.ts
  import { Module } from "@nestjs/common";
  import { ConfigService } from "@nestjs/config";
  
  export const DB_CONNECTION = "DATABASE_CONNECTION"
  
  @Module({
    providers: [
      {
        provide: DB_CONNECTION,
        useFactory: async (configService: ConfigService): Promise<string> => {
            console.log("DB connection factory is running");
            const host = configService.get<string>("DB_HOST", "localhost");
            const port = configService.get<number>("DB_PORT", 5432)
            // Имитация асинхронного подключения
            await new Promise(res => setTimeout(res, 500));
            const connectionString = `postgresql://<span class="math-inline">\{host\}\:</span>{port}/mydb`;
            console.log(`DB Connection Factory: Connected using ${connectionString}`);
            // Возвращаем строку подключения (или реальный объект подключения)
            return connectionString;
        },
        inject: [ConfigService]   
      },   
    ],
    exports: [DB_CONNECTION]
  })
  export class DatabaseModule {}
  
  // some.service.ts
  @Injectable()
  export class SomeService {
    constructor(@Inject(DB_CONNECTION) private readonly db: string) {
      console.log(`SomeService using connection: ${this.db}`)
    }
  }
  ```
- `useExisting`:
  - Как: `providers: [{ provide: "AliasToken", useExisting: OriginalToken}]`
  - Зачем: для создания псевдонима (алиаса). Когда нужно, чтобы по токену `AliasToken` возвращался тот же самый экземпляр, который предоставляется по `OriginalToken`. Полезно, чтобы один сервис был доступен под разными именами или, чтобы реализовать один интерфейс/абстрактный класс уже существующим сервисом без создания нового экземпляра
  - Пример: Алиас для логгера
  ```typescript
  // В модуле, где уже есть FileLogger (см. пример useClass)
  providers: [
    // ... FileLogger зарегистрирован ...
    {
      provide: 'SIMPLE_LOGGER_ALIAS', // Новый токен-алиас
      useExisting: FileLogger, // Указываем на существующий токен FileLogger
    }
  ],
  
  // В сервисе
  constructor(@Inject('SIMPLE_LOGGER_ALIAS') private aliasLogger: FileLogger) {} // Получит тот же экземпляр FileLogger
  ```