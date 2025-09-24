
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category } from "@/payload-types";
import { headers as getHeaders } from "next/headers";

export const authRouter = createTRPCRouter({
    session: baseProcedure.query(async ({ctx}) => {
      const headers = await getHeaders()
      
      const session = await ctx.db.auth({headers})
      return session
          
    })
})
