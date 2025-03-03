import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Request, type Response, type Router } from "express";
import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";
import { PrismaClient } from '@prisma/client'
import { getRewards } from '@prisma/client/sql'

const prisma = new PrismaClient()

export const rewardsRegistry = new OpenAPIRegistry();
export const rewardsRouter: Router = express.Router();

extendZodWithOpenApi(z);

rewardsRegistry.registerPath({
  method: "get",
  path: "/user/{userId}/rewards",
  summary: 'Get reward entitlements of a single user',
  tags: ["User"],
  request: { params: z.object({ userId: z.string().uuid().openapi({ example: "07a8035e-dff9-4d35-a4bb-6eb8d236a441" }) }), },
  responses: {
    [200]: { description: "Success", content: { "application/json": { schema: z.array(z.object({ success: z.boolean(), data: z.object({ allTimeBalance: z.string(), reportMonthly: z.array(z.object({ monthStarting: z.string(), venueCount: z.number(), spent: z.string(), cashbackEntitlement: z.string(), cashbackRate: z.string() })) }) })), }, }, },
    [415]: { description: "Invalid userId", content: { "application/json": { schema: z.object({ success: z.boolean().default(false), message: z.string().default("Invalid userId") }), }, }, },
  },
});

const calculateCashback = ({ month, venuecount, sum: sumBigInt }: getRewards.Result) => {
  const venueCount = Number(venuecount);
  const sum = Number(sumBigInt);
  const rate = venueCount >= 4 ? 0.05 * 1.1 : 0.05;
  return {
    month,
    venueCount,
    sum,
    rate,
    cashback: -1 * sum * rate,
  }
}

rewardsRouter.get("/:userId/rewards", async (req: Request, res: Response) => {
    const { userId } = req.params

    if (!z.string().uuid().safeParse(userId).success) {
      return res.status(415).json({ success: false, message: "Invalid userId" });
    }
  
    const rewards = await prisma.$queryRawTyped(getRewards(userId));

    const calculationMonthly = rewards.map(calculateCashback);

    const reportMonthly = calculationMonthly.map(({ month, venueCount, sum, cashback, rate }) => {
      const monthStarting = Intl.DateTimeFormat('en-UK', { month: 'long', year: 'numeric' }).format(month!)
      const spent = `£${(-1 * sum * 0.01).toFixed(2)}`
      const cashbackEntitlement = `£${(cashback * 0.01).toFixed(2)}`
      const cashbackRate = `${(rate * 100).toFixed(2)}%`
      return {
        monthStarting,
        venueCount,
        spent,
        cashbackEntitlement,
        cashbackRate,
      }
    });

    const allTimeBalance = `£${(calculationMonthly.reduce((acc, { cashback }) => acc + cashback, 0) * 0.01).toFixed(2)}`;

    res.json({
      success: true,
      data: {
        allTimeBalance,
        reportMonthly,
      }
    })
});
