# @muzikanto/nestjs-consul

[![npm](https://img.shields.io/npm/v/@muzikanto/nestjs-consul)](https://www.npmjs.com/package/@muzikanto/nestjs-consul)
[![downloads](https://img.shields.io/npm/dt/@muzikanto/nestjs-consul)](<(https://www.npmjs.com/package/@muzikanto/nestjs-consul)>)
[![GitHub stars](https://img.shields.io/github/stars/Muzikanto/nestjs-consul?style=social)](https://github.com/Muzikanto/nestjs-consul)
[![License](https://img.shields.io/npm/l/@muzikanto/nestjs-consul)](https://github.com/Muzikanto/nestjs-consul/blob/main/LICENSE)

A lightweight NestJS module for integrating the official consul npm package into your NestJS application.

## Why Use This Module?

- Seamless integration with NestJS DI system
- Supports async configuration
- Multi-client support
- Clean and minimal implementation

---

## Installation

```bash
yarn add @muzikanto/nestjs-consul
# also
yarn add consul
```

Peer dependencies: `@nestjs/common, @nestjs/core, consul`

## Quick Start

### Synchronous Registration (forRoot)

```ts
// app.module.ts
import { Module } from '@nestjs/common';
import { ConsulModule } from '@muzikanto/nestjs-consul';

@Module({
  imports: [
    ConsulModule.forRoot({
      host: 'localhost',
      port: 8500,
    }),
  ],
})
export class AppModule {}
```

### Using the Client in a Service

```ts
import { Inject, Injectable } from '@nestjs/common';
import Consul from 'consul';
import { InjectConsul } from '@muzikanto/nestjs-consul';

@Injectable()
export class AiService {
  constructor(
    @InjectConsul('test') private readonly consul: Consul,
  ) {}

  async registerService() {
    await this.consul.register(...);
  }
}
```

### Async Configuration (forRootAsync)

Useful when working with ConfigModule or external configuration providers.

Using useFactory

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ConsulModule } from '@muzikanto/nestjs-consul';

@Module({
  imports: [
    ConfigModule.forRoot(),
    ConsulModule.forRootAsync({
      name: 'test',
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (config: ConfigService) => ({
        host: config.get<string>('CONSUL_HOST'),
        port: +config.get<number>('CONSUL_PORT'),
      }),
    }),
  ],
})
export class AppModule {}
```

Using useClass

```ts
import { Injectable } from '@nestjs/common';
import { ConsulModuleOptionsFactory } from '@muzikanto/nestjs-consul';

@Injectable()
export class ConsulConfigService
  implements ConsulModuleOptionsFactory
{
  createConsulModuleOptions() {
    return {
      host: process.env.CONSUL_HOST,
      port: +process.env.CONSUL_PORT,
    };
  }
}
```

```ts
ConsulModule.forRootAsync({
  useClass: ConsulConfigService,
});
```

### Multi-Instance Support

You can register multiple OpenAI clients with different configurations.

```ts
@Module({
  imports: [
    ConsulModule.forRoot({
      name: 'primary',
      host: 'localhost',
      port: 8500,
    }),
    ConsulModule.forRoot({
      name: 'secondary',
      host: 'localhost',
      port: 8501,
    }),
  ],
})
export class AppModule {}
```

```ts
@Injectable()
export class MultiConsulService {
  constructor(
    @InjectConsul('primary')
    private readonly primaryClient: OpenAI,

    @InjectConsul('secondary')
    private readonly secondaryClient: OpenAI,
  ) {}
}
```

## Contributing

Contributions are welcome! Please open issues or submit PRs.

## Changelog

See [CHANGELOG](https://github.com/Muzikanto/nestjs-mcp/blob/main/CHANGELOG.md) for detailed version history and updates.
