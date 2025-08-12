import { LoadingState } from "@/components/loading-state";
import { AgentsView, AgentsViewError, AgentsViewLoading } from "@/modules/agents/ui/views/agents-views";
import { getQueryClient, trpc } from "@/trpc/server";
import {ErrorBoundary} from "react-error-boundary";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";
import { AgentsListHeader } from "@/modules/agents/ui/components/agents-list-header";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const Page = async() =>{

    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if(!session){
        redirect("/sign-in")
    }
  const queryClient = getQueryClient
  ();
  void queryClient.prefetchQuery(trpc.agents.getMany.queryOptions());
   

    return (
        <>
        <AgentsListHeader/>
        <HydrationBoundary state ={dehydrate(queryClient)}>
            <Suspense 
            fallback ={<AgentsViewLoading/>}>
                <ErrorBoundary fallback={<AgentsViewError/>}>
        <AgentsView/>
        </ErrorBoundary>
        </Suspense>
        </HydrationBoundary>
        </>
    )
}

export default  Page;