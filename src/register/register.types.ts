// consul-registration.interfaces.ts
import { ModuleMetadata, Type } from "@nestjs/common";

interface CommonOptions {
  token?: string;
}

interface CheckOptions {
  name: string;
  checkid?: string;
  serviceid?: string;
  http?: string;
  body?: string;
  header?: Record<string, string>;
  disableredirects?: boolean;
  h2ping?: string;
  h2pingusetls?: boolean;
  tlsskipverify?: boolean;
  tcp?: string;
  udp?: string;
  args?: string[];
  script?: string;
  dockercontainerid?: string;
  grpc?: string;
  grpcusetls?: boolean;
  shell?: string;
  timeout: string;
  interval?: string;
  ttl?: string;
  aliasnode?: string;
  aliasservice?: string;
  notes?: string;
  status?: string;
  deregistercriticalserviceafter?: string;
  failuresbeforewarning?: number;
  successbeforepassing?: number;
  failuresbeforecritical?: number;
}

interface RegisterConnect {
  native?: boolean;
  proxy?: any;
  sidecarservice: Record<string, any>;
}

interface RegisterOptions extends CommonOptions {
  name: string;
  id?: string;
  tags?: string[];
  address?: string;
  taggedaddresses?: Record<string, any>;
  meta?: Record<string, string>;
  namespace?: string;
  port?: number;
  kind?: string;
  proxy?: any;
  connect?: RegisterConnect;
  check?: CheckOptions;
  checks?: CheckOptions[];
}

export interface ConsulRegistrationOptions extends RegisterOptions {
  consulName?: string;
}

export interface ConsulRegistrationOptionsFactory {
  createConsulRegistrationOptions():
    | Promise<ConsulRegistrationOptions>
    | ConsulRegistrationOptions;
}

export interface ConsulRegistrationAsyncOptions extends Pick<
  ModuleMetadata,
  "imports"
> {
  consulName?: string;
  useExisting?: Type<ConsulRegistrationOptionsFactory>;
  useClass?: Type<ConsulRegistrationOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<ConsulRegistrationOptions> | ConsulRegistrationOptions;
  inject?: any[];
}
