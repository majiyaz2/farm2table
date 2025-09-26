
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category } from "@/payload-types";
import { headers as getHeaders } from "next/headers";
import { register } from "module";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { cookies as getCookies } from "next/headers";
import { AUTH_COOKIE } from "../constants";
import { registerSchema, loginSchema } from "../schema";
import { generateAuthCookie } from "../utils";

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

        const data = await ctx.db.login({
            collection: 'users', 
            data: {
                email, 
                password
            }
        })
        if(!data.token) {
            throw new TRPCError({
                code: 'UNAUTHORIZED',
                message: 'Failed to register user'
            })
        }
        await generateAuthCookie({
            prefix: ctx.db.config.cookiePrefix,
            value: data.token
         })

        return data
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

         await generateAuthCookie({
            prefix: ctx.db.config.cookiePrefix,
            value: user.token
         })

            return user
           
        })
})
