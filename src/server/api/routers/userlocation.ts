import { z } from "zod";
import { createTRPCRouter, privateProcedure } from "../trpc";


export const userLocationRouter = createTRPCRouter({
  addUserLocation: privateProcedure
    .input(z.object({
      locationId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.currentUserId;

      try {
        const exists = await ctx.prisma.userLocations.findFirstOrThrow({
          where: {
            userId: userId,
            locationId: input.locationId
          }
        });
        return exists;
      } catch (err) {
        const place = await ctx.prisma.userLocations.create({
          data: {
            userId,
            locationId: input.locationId,
          }
        })
        return place;
      }
    }),

  deleteUserLocation: privateProcedure
    .input(z.object({
      locationId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.currentUserId;

      try {
        const exists = await ctx.prisma.userLocations.delete({
          where: {
            userId_locationId: {
              userId: userId,
              locationId: input.locationId
            }
          }
        });
        return exists;
      } catch (err) {
        const place = await ctx.prisma.userLocations.create({
          data: {
            userId,
            locationId: input.locationId,
          }
        })
        return place;
      }
    }),


  getDefaultLocation: privateProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.currentUserId;

      try {
        const defaultLocation = await ctx.prisma.user.findFirstOrThrow({
          where: {
            userId: userId
          }
        })

        const place = await ctx.prisma.location.findFirstOrThrow({
          where: {
            id: defaultLocation.defaultLocation
          }
        })

        return place;
      } catch (err) {
        return null;
      }
    }),

  setDefaultLocation: privateProcedure
    .input(z.object({
      locationId: z.string()
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.currentUserId;

      const exists = await ctx.prisma.user.upsert({
        create: {
          userId: userId,
          defaultLocation: input.locationId,
        },
        update: {
          userId: userId,
          defaultLocation: input.locationId,
        },
        where: {
          userId: userId
        }
      });
      return exists;
    }),

  deleteDefaultLocation: privateProcedure
    .mutation(async ({ ctx }) => {
      const userId = ctx.currentUserId;

      const exists = await ctx.prisma.user.delete({
        where: {
          userId: userId
        }
      });
      return exists;
    }),
});