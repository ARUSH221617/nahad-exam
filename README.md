<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/17jYzJVjYdKVXGTJSgBID1cGJj_xzLb7f

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set up Environment Variables:
   - Create a `.env` file in the root directory.
   - Set the `GEMINI_API_KEY` to your Gemini API key.
   - Set the `POSTGRES_PRISMA_URL` to your PostgreSQL connection string.

3. Setup the Database:
   - Push the schema to your database:
     `npx prisma db push`

4. Run the app:
   `npm run dev`
