import { DynamicModule, Global, Module, Provider } from "@nestjs/common";
import { CONSUL_MODULE_OPTIONS, CONSUL_CLIENT } from "./consul.constants";
import {
  ConsulModuleAsyncOptions,
  ConsulModuleOptions,
  ConsulModuleOptionsFactory,
} from "./consul.types";
import Consul from "consul";

@Global()
@Module({})
export class ConsulModule {
  static forRoot({
    name,
    ...options
  }: ConsulModuleOptions & { name?: string }): DynamicModule {
    const clientProvider: Provider = {
      provide: CONSUL_CLIENT(name),
      useValue: new Consul(options),
    };

    return {
      module: ConsulModule,
      providers: [
        { provide: CONSUL_MODULE_OPTIONS(name), useValue: options },
        clientProvider,
      ],
      exports: [CONSUL_CLIENT(name)],
    };
  }

  static forRootAsync({
    name,
    ...options
  }: ConsulModuleAsyncOptions & { name?: string }): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options, name);

    const clientProvider: Provider = {
      provide: CONSUL_CLIENT(name),
      useFactory: async (opts: ConsulModuleOptions) => {
        return new Consul(opts);
      },
      inject: [CONSUL_MODULE_OPTIONS(name)],
    };

    return {
      module: ConsulModule,
      imports: options.imports,
      providers: [...asyncProviders, clientProvider],
      exports: [clientProvider],
    };
  }

  private static createAsyncProviders(
    options: ConsulModuleAsyncOptions,
    name?: string,
  ): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: CONSUL_MODULE_OPTIONS(name),
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ];
    }

    if (options.useExisting) {
      return [
        {
          provide: CONSUL_MODULE_OPTIONS(name),
          useFactory: async (optionsFactory: ConsulModuleOptionsFactory) =>
            optionsFactory.createConsulModuleOptions(name),
          inject: [options.useExisting],
        },
      ];
    }

    if (options.useClass) {
      return [
        {
          provide: CONSUL_MODULE_OPTIONS(name),
          useFactory: async (optionsFactory: ConsulModuleOptionsFactory) =>
            optionsFactory.createConsulModuleOptions(name),
          inject: [options.useClass],
        },
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
      ];
    }

    throw new Error("Invalid async configuration");
  }
}
