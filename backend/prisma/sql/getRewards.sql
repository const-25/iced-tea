select
	date_trunc('month', t."valueDate") as month,
	count(distinct rm."venueId") as venueCount,
	sum(t."amountInMinorUnit") as sum
from "RewardMatch" rm
inner join "Transaction" t on t."transactionId" = rm."transactionId"
where rm."userId"::text = $1
group by month