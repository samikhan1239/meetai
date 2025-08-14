"use client"

import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { MeetingIdViewHeader } from "../components/meeting-id-view-header";
import { useRouter } from "next/navigation";

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
            onSuccess:() =>{
                queryClient.invalidateQueries(trpc.meetings.getMany.queryOptions({}));


                router.push("/meetings");
            },
            onError: () =>{}
        })

    )

return(
    <>
    
    <div className="flex-1 py-4 px-4 md:px-8 flex flex-col gap-y-4"> 

        <MeetingIdViewHeader
        meetingId={meetingId}
        meetingName={data.name}
        onEdit={()=>{}}
        onRemove={()=>{}}
       
        
        
        
        />
       {JSON.stringify(data, null, 2)}

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

