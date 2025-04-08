Link to deploy on Netlify
https://blueprint-acasal.netlify.app/

The Problem:
Create a diagnostic screener with 8 questions and a way to submit responses.

The Solution + Reasoning Behind My Tech Choices:

This app uses:
- Vite for the frontend
- Supabase Edge Functions for the backend
- Netlify for static hosting

Why Vite?
- Fast development experience and optimized build output
- Ideal for projects where performance and developer experience matter

Why Supabase?
- Supabase Edge Functions work similarly to AWS Lambdas, aligning with how Blueprint uses serverless.
- Offers a full suite (auth, database, file storage) and generous free tier, which reduces configuration burden.
- Row Level Security (RLS) protects sensitive data by default — unauthenticated users can’t access data they shouldn’t.

How I would deploy this as a true production app:
If traffic or feature scope grows:
- We could consider moving to Next.js for better SSR/ISR capabilities and routing flexibility.
- If more complex backend logic emerges (e.g., analytics, data modeling, scraping), spin up a Python API on AWS Lambda or Fargate alongside the current stack.

Security:
- Store environment variables securely, never in the frontend.
- Keep API keys in Supabase Edge Function environment config — not exposed to the browser.

Observability and Troubleshooting:
- Add Sentry for frontend error boundaries and backend issue tracking.
- Use Netlify deploy and usage logs during early stages; consider CloudWatch if migrating backend infra to AWS.
- Add Amplitude for event-level tracking to identify where users drop off or encounter issues.


Trade-offs and Future Improvements
- To simplify the demo, I included two tabs in the same app (for viewing submissions and creating one). In a full build, these might be two distinct portals (patient/therapist).
- Didn’t include unit or E2E tests — in a production scenario (especially if HIPAA compliance is required), I’d add tests to guarantee input validation, data integrity, and access controls.
- Could improve mobile responsiveness and keyboard navigation for a better a11y/UX experience.

Code Samples from Other Projects
Unfortunately, most recent code is in private client repos via Upwork. That said, one project I’m proud of:

I built a unified data source that pulled from two separate mortgage/loan APIs. I resolved mismatches by creating a normalized addresses table, then standardized and de-duped input by trimming, lowercasing, and shortening address strings to match across APIs.

LinkedIn profile: https://www.linkedin.com/in/andrewcasal/
Resume: https://docs.google.com/document/d/1eswWdrU6jgpbUIQADIxHGXQEe-pW5uv_2pQ-qXu2jiU/edit?usp=sharing
