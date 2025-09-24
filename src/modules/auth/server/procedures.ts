
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category } from "@/payload-types";
import { headers as getHeaders } from "next/headers";
import { register } from "module";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { cookies as getCookies } from "next/headers";
import { AUTH_COOKIE } from "../constants";

export const authRouter = createTRPCRouter({
    session: baseProcedure.query(async ({ctx}) => {
      const headers = await getHeaders()
      
      const session = await ctx.db.auth({headers})
      return session
          
    }),
    logout: baseProcedure.mutation(async ({ctx}) => {
      const cookies = await getCookies();
      cookies.delete(AUTH_COOKIE);
      return {success: true};
    }),
    register: baseProcedure
        .input(
            z.object({
                email: z.email(),
                password: z.string().min(3),
                username: z
                    .string()
                    .min(3, "Username must be at least 3 characters")
                    .max(63, "Username must be less than 63 characters")
                    .regex(/^[a-z0-9][a-z0-9]*[a-z0-9]+$/, "Username must contain only letters, numbers, and hyphens, and must start and end with a letter or number")
            })
        )
        .mutation(async ({ctx, input}) => {
            const {email, password, username} = input
        
            const user = await ctx.db.create({
            collection: 'users', 
            data: {
                email, 
                password,
                username
            }
        })
        return user
    }),
    login: baseProcedure
        .input(
            z.object({
                email: z.email(),
                password: z.string(),
            })
        )
        .mutation(async ({ctx, input}) => {
            const {email, password} = input
        
            const user = await ctx.db.login({
                collection: 'users', 
                data: {
                    email, 
                    password
                }
            })

            if(!user.token) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'Invalid credentials'
                })
            }

            const cookies = await getCookies();

            cookies.set({
                name: AUTH_COOKIE,
                value: user.token,
                httpOnly:true,
                path:"/"
            })

            return user
           
        })
})
