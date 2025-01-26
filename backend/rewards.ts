import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Request, type Response, type Router } from "express";
import { z } from "zod";
import { PrismaClient } from '@prisma/client'
import { createApiResponse } from "./express/api-docs/openAPIResponseBuilders";

const prisma = new PrismaClient()

export const rewardsRegistry = new OpenAPIRegistry();
export const rewardsRouter: Router = express.Router();

rewardsRegistry.registerPath({
  method: "get",
  path: "/user/{userId}/rewards",
  summary: 'Get reward entitlements of a single user',
  tags: ["User"],
  // request: {
  //   params: z.object({ userId: z.string() }),
  // },
  responses: createApiResponse(z.null(), "Success"),
});

rewardsRouter.get("/:userId/rewards", async (req: Request, res: Response) => {
    const { userId } = req.params
  
    const rewards = await prisma.rewardMatch.findMany({
      where: {
        userId,
      },
    })
    
    res.json(rewards)
});
