// consul-registration.service.ts
import {
  Inject,
  Injectable,
  OnModuleDestroy,
  OnModuleInit,
} from "@nestjs/common";
import Consul from "consul";
import { randomUUID } from "crypto";
import { InjectConsul } from "@muzikanto/nestjs-consul";
import { CONSUL_REGISTRATION_OPTIONS } from "./register.constants";
import { ConsulRegistrationOptions } from "./register.types";

@Injectable()
export class ConsulRegistrationService
  implements OnModuleInit, OnModuleDestroy
{
  private serviceId!: string;

  constructor(
    protected readonly consul: Consul,
    @Inject(CONSUL_REGISTRATION_OPTIONS)
    private readonly options: ConsulRegistrationOptions,
  ) {}

  async onModuleInit() {
    this.serviceId = this.options.id || `${this.options.name}-${randomUUID()}`;

    await this.consul.agent.service.register({
      ...this.options,
      id: this.serviceId,
    });
  }

  async onModuleDestroy() {
    if (!this.serviceId) return;

    await this.consul.agent.service.deregister(this.serviceId);
  }
}
