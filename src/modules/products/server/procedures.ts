
import { Category, Media, Tenant } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Sort, Where } from "payload";
import { z } from "zod";
import { sortOptions } from "../searchParams";
import { DEFAULT_PAGE_LIMIT } from "@/constants";
import {headers as getHeaders} from "next/headers";

export const productsRouter = createTRPCRouter({
    getOne: baseProcedure.input(
        z.object({
            id: z.string(),
    })
    )
    .query(async ({ctx, input}) => {
        const headers = await getHeaders();
        const session = await ctx.db.auth({headers});

        const data = await ctx.db.findByID({
            collection: "products",
            id: input.id,
            depth: 2,
        });

        let isPurchased = false;
        if(session.user){
            const ordersData = await ctx.db.find({
                collection: "orders",
                pagination:false,
                limit: 1,
                where: {
                    and:[
                        {
                            product: {
                                equals: input.id
                            }
                        },
                        {
                            user: {
                                equals: session.user.id
                            }
                        }
                    ]
                }
            })

            isPurchased = !!ordersData.docs[0];
        }

        return {
            ...data,
            isPurchased,
            image: data.image as Media | null,
            cover: data.cover as Media | null,
            tenant: data.tenant as Tenant & {image: Media | null}
        };
    }),
    getMany: baseProcedure.input(z.object({
        cursor: z.number().default(1),
        limit: z.number().default(DEFAULT_PAGE_LIMIT),
        category: z.string().nullable().optional(),
        minPrice: z.string().nullable().optional(),
        maxPrice: z.string().nullable().optional(),
        tags: z.array(z.string()).nullable().optional(),
        sort: z.enum(sortOptions).nullable().optional(),
        tenantSlug: z.string().nullable().optional(),
        })).query(async ({ctx, input}) => {
        const where:Where = {};
        let sort:Sort = "-createdAt";

        if(input.sort == "curated"){
            sort = "name";
        }else if(input.sort == "trending"){
            sort = "+createdAt";
        }else if(input.sort == "hot_and_new"){
            sort = "-createdAt";
        }

        if(input.minPrice && input.maxPrice){
            where.price = {
                greater_than_equal: input.minPrice,
                less_than_equal: input.maxPrice
            }
        }else if(input.minPrice){
            where.price = {
                greater_than_equal: input.minPrice
            }
        }else if(input.maxPrice){
            where.price = {
                less_than_equal: input.maxPrice
            }
        } 

        if(input.tenantSlug){
            where["tenant.slug"] = {
                equals: input.tenantSlug
            }
        }

        
        if (input.category) {
         const categoriesData = await ctx.db.find({
            collection: "categories",
            pagination: false,
            limit: 1,
            depth: 1,
            where: {
                slug: {
                    equals: input.category,
                }
            },
         });   

           const formattedData = categoriesData.docs.map((doc) => ({
                ...doc,
                subcategories: (doc.subcategories?.docs ?? []).map((sub) => ({
                    ...(sub as Category),
                    subcategories: [],
                }))
            }));
         const subcategorySlugs:string[] = []
         const parentCategory = formattedData[0];

         if (parentCategory) {
            subcategorySlugs.push(
                ...parentCategory.subcategories.map((subcategory) => subcategory.slug)
            )       
            where["category.slug"] = {
                in: [parentCategory.slug, ...subcategorySlugs]
            };
        }
        }

        if (input.tags && input.tags.length > 0) {
            where["tags.name"] = {
                in: input.tags
            }
        }
      
        const data = await ctx.db.find({
            collection: "products",
            depth: 2,
            where,
            sort,
            page: input.cursor,
            limit: input.limit,
        });
          
        return {
            ...data,
            docs: data.docs.map((doc) => ({
                ...doc,
                image: doc.image as Media | null,
                tenant: doc.tenant as Tenant & {image: Media | null}
            }))
        };
    })
})

