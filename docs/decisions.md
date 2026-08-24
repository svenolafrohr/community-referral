# V0 decisions and assumptions

1. **Controlled-link access:** no end-user login in V0; public-read policies expose only active jobs.
2. **Studio administration:** drafts, parsing corrections, and activation happen in Supabase Studio.
3. **No candidate data by default:** the candidate email column is reserved but must remain unused until a consent flow exists.
4. **Provider-neutral ingestion:** the webhook persists a normalized email envelope; provider and LLM adapters are deferred.
5. **Anonymous referrals:** V0 referral codes can exist without a referrer record and can be associated after authentication is introduced.
6. **Manual payments:** bonus values are informational; settlement and platform take rate are not implemented.
7. **Frontend ownership:** the current UI proves routes and states only. Product design remains with the frontend contributor.
