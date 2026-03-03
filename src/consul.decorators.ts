import { Inject } from "@nestjs/common";
import { CONSUL_CLIENT } from "./consul.constants";

export const InjectConsul = (name?: string) => Inject(CONSUL_CLIENT(name));
