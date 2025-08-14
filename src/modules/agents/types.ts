import {inferRouterOutputs} from "@trpc/server";

import type {AppRouter} from "@/trpc/routers/_app";

export type AgentGetMany = inferRouterOutputs<AppRouter>["agents"]["getOne"];

export type AgentGetOne = inferRouterOutputs<AppRouter>["agents"]["getOne"];