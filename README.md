# iced-tea
by Alex S.

26 Jan 2025

## Preliminary

### Requirements
- [x] Store each transaction in a database
- [x] Attempt to match it against one of the venues listed below
- [x] Calculate a cashback reward for each user each month
    - [x] For every venue they visit they get 5% cashback
    - [x] And if they visit more than three venues in a month they get an extra 10% of the total
- [x] Write a README documenting your solution and any assumptions and decisions you made

### Assumptions
- The JSONL is clean
- The venue list is static, and any scaling is manageable
- Having a high throughput is desirable
- No two venues should have unacceptably similar identifiers
- Use calendar month, ignore timezones
- Redemption is out of scope
- The extra 10% applies to the cashback amount, not the money spent. For example, instead of receiving 15% cashback, you would receive 5.5%.

### Decisions
- Use Node.js, Prisma, PostgreSQL, and redis
- Two-step approach: exact matches (`matcher.ts`), and pattern matches (`discovery.ts`)
- Use bloom filter to skip costly pattern matches for known negatives
- No fuzzy string match for discovery
- Use simple express-prisma

## Instruction
1. Clone this repo
2. Run `docker-compose up --build` at root dir
3. Navigate to `http://localhost:3001`
4. Open `User`
5. Click `Try it out`, and `Execute`

### Troubleshooting
- Make sure Docker is installed
- Try `docker compose up --build`
- Make sure ports `3001`, `5432`, `6379`, and `8001` are unused.
- Do not use Safari

## Planing

What features do I want to develop? What is the rough plan for the application?
- [x] Project initialisation
- [x] Docker
    - [x] PostgreSQL
    - [x] Redis
    - [x] Node.js REST pi
- [x] Schema/type
    - [x] Seeding script
- [x] Chore: seeding
    - [x] Seed venues, postgres
    - [x] Reserve, redis
- [x] Feature: ingress
    - [x] Parsing transaction
    - [x] Persistence to PostgreSQL
    - [x] Make it part of the seeding script
- [x] Feature: matcher
    - [x] Match known positives using redis hashes
    - [x] Persistence to PostgreSQL
    - [x] Match known negatives using redis bloom filter
- [x] Feature: discovery
    - [x] Simple regex & premutation match
    - [x] Persistence to redis
    - [x] Persistence to PostgreSQL
- [x] Feature: reward calculations
    - [x] Queries and calculations
    - [x] REST api