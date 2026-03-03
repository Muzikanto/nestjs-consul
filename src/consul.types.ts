import { ModuleMetadata, Type } from '@nestjs/common';
import { Agent as httpAgent } from "http";
import { Agent as httpsAgent } from "https";

interface CommonOptions {
  token?: string;
}

interface DefaultOptions extends CommonOptions {
  dc?: string;
  partition?: string;
  wan?: boolean;
  consistent?: boolean;
  stale?: boolean;
  index?: string;
  wait?: string;
  near?: string;
  filter?: string;
}

export type ConsulModuleOptions = {
  host?: string;
  port?: number;
  secure?: boolean;
  defaults?: DefaultOptions;
  agent?: httpAgent | httpsAgent;
}

export interface ConsulModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useFactory?: (
    ...args: any[]
  ) => Promise<ConsulModuleOptions> | ConsulModuleOptions;
  inject?: any[];
  useExisting?: Type<ConsulModuleOptionsFactory> | string;
  useClass?: Type<ConsulModuleOptionsFactory>;
}

export interface ConsulModuleOptionsFactory {
  createConsulModuleOptions(name?: string):
    | Promise<ConsulModuleOptions>
    | ConsulModuleOptions;
}