# iced-tea
by Alex S.

26 Jan 2025

## Preliminary

### Requirements
- [x] Store each transaction in a database
- [x] Attempt to match it against one of the venues listed below
- [ ] Calculate a cashback reward for each user each month
    - [ ] For every venue they visit they get 5% cashback
    - [ ] And if they visit more than three venues in a month they get an extra 10% of the total
- [ ] Write a README documenting your solution and any assumptions and decisions you made

### Assumptions
- The JSONL is clean
- The venue list is static, and any scaling is manageable
- Having a high throughput is desirable
- No two venues should have unacceptably similar identifiers
- Use calendar month
- Redemption is out of scope

### Decisions
- Use Node.js, Prisma, PostgreSQL, and redis
- Two-step approach: exact matches (`matcher.ts`), and pattern matches (`discovery.ts`)
- Use bloom filter to skip costly pattern matches for known negatives
- No fuzzy string match for discovery

## Planing

What features do I want to develop? What is the rough plan for the application?
- [x] Project initialisation
- [x] Docker
    - [x] PostgreSQL
    - [x] Redis
    - [ ] Node.js REST pi
- [x] Schema/type
    - [ ] Seeding script
- [x] Chore: seeding
    - [ ] Seed venues, postgres
    - [x] Reserve, redis
- [x] Feature: ingress
    - [x] Parsing transaction
    - [x] Persistence to PostgreSQL
    - [ ] Make it part of the seeding script
- [x] Feature: matcher
    - [x] Match known positives using redis hashes
    - [x] Persistence to PostgreSQL
    - [x] Match known negatives using redis bloom filter
- [x] Feature: discovery
    - [x] Simple regex & premutation match
    - [x] Persistence to redis
    - [x] Persistence to PostgreSQL
- [ ] Feature: reward calculations
    - [] Queries and calculations
    - [] REST api