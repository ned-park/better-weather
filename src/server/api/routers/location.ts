import { z } from "zod";


import { createTRPCRouter, privateProcedure, publicProcedure } from "../trpc";
// import type { Place } from "~/interfaces/place";
import type { Location } from "~/interfaces/location";
import type { User } from "@clerk/nextjs/dist/types/server";
import type { PrismaClient, Prisma } from "@prisma/client";
import type { DefaultArgs } from "@prisma/client/runtime";

type placeType = {
  id: string,
  name: string,
  latitude: number,
  longitude: number,
  elevation: number,
  admin3: string,
  admin1: string,
  admin2: string,
  country: string,
}

const addLocations = async (ctx: { prisma: PrismaClient<Prisma.PrismaClientOptions, never, Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined, DefaultArgs>; currentUser: User | null | undefined; }, places: placeType[]) => {
  void await ctx.prisma.location.createMany({data: places, skipDuplicates: true});
  return;
}

export const locationRouter = createTRPCRouter({
  getPlacesByName: publicProcedure
    .input(
      z.object({
        name: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      let places = await ctx.prisma.location.findMany({
        where: { name: input.name },
        take: 100
      })

      if (places.length === 0) {
        const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${input.name}&count=30&language=en&format=json`);
        if (response && response.ok) {
          const data = await response.json() as Location;

          places = data.results.map(place => ({
            id: `${place.id}`,
            name: place.name,
            latitude: place.latitude,
            longitude: place.longitude,
            elevation: place.elevation?? 0,
            admin1: place.admin1 ?? "",
            admin2: place.admin2 ?? "",
            admin3: place.admin3 ?? "",
            country: place.country ?? "",
          })) as placeType[];
          if (!places || !places.length) return [];
          await addLocations(ctx, places);
        }
      } 

        return places;
    }),

  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.location.findMany();
  }),

  addUserLocation: privateProcedure
    .input(z.object({
      locationId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.currentUser.id;

      const place = await ctx.prisma.userLocations.create({
        data: {
          userId,
          locationId: input.locationId,
        }
      })

      return place;
    }),
});

