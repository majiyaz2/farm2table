
import { Category } from "@/payload-types";
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Where } from "payload";
import { z } from "zod";

export const productsRouter = createTRPCRouter({
    getMany: baseProcedure.input(z.object({
        category: z.string().nullable().optional(),
        minPrice: z.number().nullable().optional(),
        maxPrice: z.number().nullable().optional(),
        })).query(async ({ctx, input}) => {
        const where:Where = {};

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

      
        const data = await ctx.db.find({
            collection: "products",
            depth: 1,
            where,
        });

       
      
          
        return data;
    })
})

