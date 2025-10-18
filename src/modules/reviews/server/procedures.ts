
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import z from "zod";
import { TRPCError } from "@trpc/server";

export const reviewsRouter = createTRPCRouter({
    getOne: protectedProcedure
        .input(z.object({
            productId: z.string(),
        }))
        .query(async ({ctx, input}) => {
      
          const product = await ctx.db.findByID({
            collection: "products",
            id: input.productId,
          });

          if(!product){
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Product not found",
            });
          }

          const reviewData = await ctx.db.find({
            collection: "reviews",
            limit: 1,
            where: {
                and: [
                    {
                        product:{
                            equals: input.productId
                        }
                    },
                    {
                        user:{
                            equals: ctx.session.user.id
                        }
                    }
                ]
            }
          });

          const review = reviewData.docs[0];

          if(!review){
           return null;
          }
          

          return review;    
    }),

    create: protectedProcedure
        .input(z.object({
            productId: z.string(),
            rating: z.number().min(1,  {message: "Rating must be between 1 and 5"}).max(5, {message: "Rating must be between 1 and 5"}),
            description: z.string().min(1, {message: "Description is required"}).max(1000, {message: "Description must be at most 1000 characters long"}),
        }))
        .mutation(async ({ctx, input}) => {
          const product = await ctx.db.findByID({
            collection: "products",
            id: input.productId,
          });

          if(!product){
            throw new TRPCError({
              code: "NOT_FOUND",
              message: "Product not found",
            });
          }

          const exsistingReview = await ctx.db.find({
            collection: "reviews",
            limit: 1,
            where: {
                and: [
                    {
                        product:{
                            equals: input.productId
                        }
                    },
                    {
                        user:{
                            equals: ctx.session.user.id
                        }
                    }
                ]
            }
          });

         

          if(exsistingReview.totalDocs > 0){
            throw new TRPCError({
              code: "BAD_REQUEST",
              message: "You have already reviewed this product",
            });
          }

          const reviewData = await ctx.db.create({
            collection: "reviews",
            data: {
                product: input.productId,
                user: ctx.session.user.id,
                rating: input.rating,
                description: input.description,
            }
          });

          return reviewData;
    }),
    update: protectedProcedure
        .input(z.object({
            reviewId: z.string(),
            rating: z.number().min(1,  {message: "Rating must be between 1 and 5"}).max(5, {message: "Rating must be between 1 and 5"}),
            description: z.string().min(1, {message: "Description is required"}).max(1000, {message: "Description must be at most 1000 characters long"}),
        }))
        .mutation(async ({ctx, input}) => {

            const exsistingReview = await ctx.db.findByID({
                collection: "reviews",
                id: input.reviewId,
            });

            if(!exsistingReview){
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Review not found",
                });
            }

            if(exsistingReview.user !== ctx.session.user.id){
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "You are not authorized to update this review",
                });
            }
            const updatedReview = await ctx.db.update({
                collection: "reviews",
                id: input.reviewId,
                data: {
                    rating: input.rating,
                    description: input.description,
                }
            });

            return updatedReview;
    }),
    delete: protectedProcedure
        .input(z.object({
            reviewId: z.string(),
        }))
        .mutation(async ({ctx, input}) => {
            const deletedReview = await ctx.db.delete({
                collection: "reviews",
                id: input.reviewId,
            });

            return deletedReview;
    }),

})

