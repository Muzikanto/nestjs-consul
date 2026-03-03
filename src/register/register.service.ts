import {
  Inject,
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from "@nestjs/common";
import Consul from "consul";
import { randomUUID } from "crypto";
import { CONSUL_REGISTRATION_OPTIONS } from "./register.constants";
import { ConsulRegistrationOptions } from "./register.types";

@Injectable()
export class ConsulRegistrationService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private serviceId!: string;
  private logger = new Logger('Consul');

  constructor(
    protected readonly consul: Consul,
    @Inject(CONSUL_REGISTRATION_OPTIONS)
    private readonly options: ConsulRegistrationOptions,
  ) {}

  async onApplicationBootstrap() {
    this.serviceId = this.options.id || `${this.options.name}-${randomUUID()}`;

    await this.consul.agent.service.register({
      ...this.options,
      id: this.serviceId,
    });

    this.logger.debug(`Service register ${this.options.name}`)
  }

  async onApplicationShutdown() {
    if (!this.serviceId) return;

    await this.consul.agent.service.deregister(this.serviceId);

    this.logger.debug(`Service deregister ${this.options.name}`)
  }
}
