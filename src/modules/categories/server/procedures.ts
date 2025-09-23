
import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { Category } from "@/payload-types";

export const categoriesRouter = createTRPCRouter({
    getMany: baseProcedure.query(async ({ctx}) => {
      
          const data = await ctx.db.find({
              collection: "categories",
              where: {
                  parent: {
                      exists: false,
                  },
              },
              depth: 1,
              pagination: false,
              sort: "name",
          });
      
          const formattedData = data.docs.map((doc) => ({
              ...doc,
              subcategories: (doc.subcategories?.docs ?? []).map((sub) => ({
                  ...(sub as Category),
                  subcategories: [],
              }))
          }));

          return formattedData;
    })
})
