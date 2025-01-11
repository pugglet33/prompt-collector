# Art Prompt Collector

A web application for collecting and organizing art prompts for AI image generation models like Stable Diffusion.

## Features

- Modern black and green theme
- Mobile and desktop responsive design
- Prompt submission with optional name and negative prompt
- Category management (select existing or create new)
- PostgreSQL database with Prisma ORM

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your database:
- Create a PostgreSQL database
- Update the DATABASE_URL in `.env` with your database connection string

3. Run database migrations:
```bash
npx prisma migrate dev
```

4. Start the development server:
```bash
npm run dev
```

## Deployment

This project is designed to be deployed on Vercel:

1. Create a new project on Vercel
2. Connect your GitHub repository
3. Add your DATABASE_URL to the environment variables
4. Deploy!

## Database Schema

The application uses two main models:

- Category: Stores prompt categories
- Prompt: Stores the actual prompts with their associated category

## API Routes

- POST /api/prompts - Create a new prompt
- GET /api/prompts - Get all prompts
- GET /api/categories - Get all categories
