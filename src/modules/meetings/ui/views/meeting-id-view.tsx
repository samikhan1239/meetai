"use client"

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { useRouter } from "next/navigation";
import { UpcomingState } from "../components/upcoming-state";
import { ActiveState } from "../components/active-state";
import { Cancel } from "@radix-ui/react-alert-dialog";
import { CancelledState } from "../components/cancelled-state";
import { ProcessingState } from "../components/processing-state";
import { CompletedState } from "../components/completed-state";

interface Props{
    meetingId: string;
};


export const MeetingIdView = ({meetingId} : Props) => {
    const trpc = useTRPC();
    const router= useRouter();
    const queryClient= useQueryClient();



    const {data} = useSuspenseQuery(
     trpc.meetings.getOne.queryOptions({id: meetingId}),
    );


    const removeMeeting = useMutation(
        trpc.meetings.remove.mutationOptions({
            onSuccess: async() =>{
                await queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));
                   await  queryClient.invalidateQueries(
                    trpc.premium.getFreeUsage.queryOptions(),
                );



                router.push("/meetings");
            },
            onError: () =>{}
        })

    )

    const isActive = data.status ==="active";
    const isUpcoming = data.status ==="upcoming";
    const isCancelled = data.status ==="cancelled";
    const isCompleted = data.status ==="completed";
    const isProcessing = data.status ==="processing";
   


return(
    <>
    
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4"> 

        <MeetingIdViewHeader
        meetingId={meetingId}
        meetingName={data.name}
        onEdit={()=>{}}
        onRemove={()=>{}}
       
        
        
        
        />
      {isCancelled && <CancelledState/>}
      {isProcessing && <ProcessingState/>}
      {isCompleted && <CompletedState
      data={data}/>}
      {isUpcoming && <UpcomingState
      meetingId={meetingId}
      onCancelMeeting={() => {}}
      isCancelling={false}
      />}
      {isActive && <ActiveState meetingId={meetingId} />}

   

    </div>
    
    </>
)
};

export const MeetingIdViewLoading =() => {
  return (
    <LoadingState
    title ="Loading Meetings"
    description ="This may take a few seconds" />
  )
}

export const MeetingIdViewError =() =>{
  return (
    <ErrorState
    title ="Error Loading Meetings"
    description ="Something went wrong"
    />
  )
}

