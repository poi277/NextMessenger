'use server'

import ChatingForm from "@/features/chat/ChatingForm";

export default async function chatingPage()
{
  return(
    <div>
        <ChatingForm/>
    </div>
  )
}