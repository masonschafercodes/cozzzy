Basic project template that makes it easier to be more productive right out the gate.

# Getting Started

First step is to install the required deps:

```bash
pnpm install
```

You'll need to make a copy of the example environment file into your local `.env` file

```bash
cp .env.example .env
```

During your initial setup process, you will need to ensure that your DB is setup properly.

- The first thing you need to do is get your Docker container setup and started:

```bash
pnpm dev:docker
```

- Run your migrations by using the following command:

```bash
pnpm db:migrate:dev
```

You should now be able to start the dev environment fully. This will concurrently start your Docker container and NextJS server.

```bash
pnpm dev
```

The new project should now be available on: [localhost:3000](http://localhost:3000)

## Core Tech

The core foundation of the template is built with the following:

- **[Next.js](https://nextjs.org/)**
- **[Prisma](https://www.prisma.io/)**
- **[TypeScript](https://www.typescriptlang.org/)**

The rest of the stuff listed was used to implement the features included in the template:

- **[Tailwind](https://tailwindcss.com/)**
- **[React Hook Form](https://react-hook-form.com/)**
- **[NextAuth.js](https://next-auth.js.org/)**

## Features

- Auth with NextAuth.js
- Authenticated routes and data.
- Pre-configured Next.js API routes
