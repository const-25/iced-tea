import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import express from 'express';
import { rewardsRouter } from './rewards';
import { PrismaClient } from '@prisma/client';

vi.mock('@prisma/client', () => {
    const mPrismaClient = {
        $queryRawTyped: vi.fn(),
    };
    return { PrismaClient: vi.fn(() => mPrismaClient) };
});

const app = express();
app.use(express.json());
app.use('/rewards', rewardsRouter);

describe('GET /:userId/rewards', () => {
    it('should return rewards for a valid userId', async () => {
        const prisma = new PrismaClient();
        const mockRewards = [
            { month: new Date('2023-01-01'), venuecount: 4, sum: BigInt(-10000) },
            { month: new Date('2023-02-01'), venuecount: 3, sum: BigInt(-10000) },
            { month: new Date('2023-03-01'), venuecount: 2, sum: BigInt(-10000) },
        ];
        prisma.$queryRawTyped.mockResolvedValue(mockRewards);

        const response = await request(app).get('/rewards/07a8035e-dff9-4d35-a4bb-6eb8d236a441/rewards');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.allTimeBalance).toBe('£16.00');
        expect(response.body.data.reportMonthly).toHaveLength(3);
    });

    it('should return an empty array if no rewards are found', async () => {
        const prisma = new PrismaClient();
        prisma.$queryRawTyped.mockResolvedValue([]);

        const response = await request(app).get('/rewards/07a8035e-dff9-4d35-a4bb-6eb8d236a441/rewards');

        expect(response.status).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.data.allTimeBalance).toBe('£0.00');
        expect(response.body.data.reportMonthly).toHaveLength(0);
    });

});