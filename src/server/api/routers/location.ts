import { z } from "zod";


import { createTRPCRouter, publicProcedure } from "../trpc";
// import type { Place } from "~/interfaces/place";

// function addPlacesToDatabase(places: Array<Place>) {
//   if (!places || !places.length) return;
  // locationRouter.addPlaces({places});
// }

export const locationRouter = createTRPCRouter({
  getPlacesByName: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      let places;
      places = await ctx.prisma.location.findMany({
        where: { name: input.name },
        take: 100
      })

      if (places.length === 0) {
        places = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${input.name}&count=30&language=en&format=json`);
        // add new places to database async
        // ! await addPlacesToDatabase(places);
      }

      return places;
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.location.findMany();
  }),

  // addPlace: publicProcedure
  // .input(
  //   z.object({
  //     places: z.ZodObject(),
  //   })
  // )
  // .query(async ({ctx, places}) => {
  //   await ctx.prisma.location.createMany(places);
  // })
});
