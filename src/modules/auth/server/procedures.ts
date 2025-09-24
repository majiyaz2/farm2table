
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category } from "@/payload-types";
import { headers as getHeaders } from "next/headers";
import { register } from "module";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { cookies as getCookies } from "next/headers";
import { AUTH_COOKIE } from "../constants";
import { registerSchema, loginSchema } from "../schema";

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
        .input(registerSchema)
        .mutation(async ({ctx, input}) => {
            const existingData = await ctx.db.find({
                collection: 'users', 
                limit: 1,
                where: {
                    username: {
                        equals: input.username
                    }
                }
            })

            const existingUser = existingData?.docs[0]

            if(existingUser) {
                throw new TRPCError({
                    code: 'BAD_REQUEST',
                    message: 'Username already taken'
                })
            }

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
            loginSchema
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

            console.log(cookies)

            return user
           
        })
})
