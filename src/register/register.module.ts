import { DynamicModule, Module, Provider } from "@nestjs/common";
import { CONSUL_REGISTRATION_OPTIONS } from "./register.constants";
import {
  ConsulRegistrationAsyncOptions,
  ConsulRegistrationOptions,
  ConsulRegistrationOptionsFactory,
} from "./register.types";
import { ConsulRegistrationService } from "./register.service";
import Consul from "consul";
import { CONSUL_CLIENT, CONSUL_MODULE_OPTIONS } from "../consul.constants";

@Module({})
export class ConsulRegistrationModule {
  static forRoot({
    consulName,
    ...options
  }: ConsulRegistrationOptions): DynamicModule {
    return {
      module: ConsulRegistrationModule,
      providers: [
        {
          provide: CONSUL_REGISTRATION_OPTIONS,
          useValue: options,
        },
        {
          provide: ConsulRegistrationService,
          useFactory: (consul: Consul) => new ConsulRegistrationService(consul, options),
          inject: [CONSUL_CLIENT(consulName)],
        },
      ],
    };
  }

  static forRootAsync({
    consulName,
    ...options
  }: ConsulRegistrationAsyncOptions): DynamicModule {
    const asyncProviders = this.createAsyncProviders(options);

    return {
      module: ConsulRegistrationModule,
      imports: options.imports,
      providers: [
        ...asyncProviders,
        {
          provide: ConsulRegistrationService,
          useFactory: (consul: Consul, options: ConsulRegistrationOptions) => new ConsulRegistrationService(consul, options),
          inject: [CONSUL_CLIENT(consulName), CONSUL_MODULE_OPTIONS],
        },
      ],
    };
  }

  private static createAsyncProviders(
    options: ConsulRegistrationAsyncOptions,
  ): Provider[] {
    if (options.useFactory) {
      return [
        {
          provide: CONSUL_REGISTRATION_OPTIONS,
          useFactory: options.useFactory,
          inject: options.inject || [],
        },
      ];
    }

    if (options.useClass) {
      return [
        {
          provide: CONSUL_REGISTRATION_OPTIONS,
          useFactory: async (factory: ConsulRegistrationOptionsFactory) =>
            factory.createConsulRegistrationOptions(),
          inject: [options.useClass],
        },
        {
          provide: options.useClass,
          useClass: options.useClass,
        },
      ];
    }

    if (options.useExisting) {
      return [
        {
          provide: CONSUL_REGISTRATION_OPTIONS,
          useFactory: async (factory: ConsulRegistrationOptionsFactory) =>
            factory.createConsulRegistrationOptions(),
          inject: [options.useExisting],
        },
      ];
    }

    throw new Error("invalid consul registration");
  }
}
