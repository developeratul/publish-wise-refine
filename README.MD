## PublishWise

![null](https://tpwpzkeqppkvywajnezp.supabase.co/storage/v1/object/public/blog-images/3212fce1-4595-446c-a9ab-40c9e148cf8a/59ef2ba0-4e77-4ed7-a18f-9c3938064ce2/06c26644-fd1f-48d7-8500-103db915c8e7.jpg)

### Project Demo link

The project is live at [PublishWise.ink](http://publishwise.ink)

## About

PublishWise is a tool that allows you to write and publish blogs from a single platform. It includes an ideal editor for writing blogs and publishing them on Dev.to and HashNode (with more to come). You can easily make updates to your blog that has been published in both Dev.to and HashNode by modifying it once on PublishWise. It simplifies cross-posting and consolidates your blogs onto a single platform. This project has a lot of potential and will continue to add more valuable features in the future.

### Description

This project was bootstrapped using [Refine](http://refine.dev). It uses [Supabase](http://supabase.com) as the database, storage, and auth provider. The UI is built using the [Mantine](http://mantine.dev) UI library together with Refine. Other than that, it uses Refine data hooks for performing queries and mutations throughout the whole application. The whole application is built on top of the Next.js app directory and utilizes the new features of Next.js.

### Participants

- Minhazur Rahaman Ratul ([@developeratul](http://developeratul.com))

<!-- -->

### Preview

The dashboard (dark)

![null](https://tpwpzkeqppkvywajnezp.supabase.co/storage/v1/object/public/blog-images/3212fce1-4595-446c-a9ab-40c9e148cf8a/59ef2ba0-4e77-4ed7-a18f-9c3938064ce2/bf335128-f600-4eb3-9147-cef0b3985fc6.jpeg)The dashboard (light)

![null](https://tpwpzkeqppkvywajnezp.supabase.co/storage/v1/object/public/blog-images/3212fce1-4595-446c-a9ab-40c9e148cf8a/59ef2ba0-4e77-4ed7-a18f-9c3938064ce2/afc982be-a0e6-47e5-a99f-ad7e79b0b6d4.jpeg)The Editor

![null](https://tpwpzkeqppkvywajnezp.supabase.co/storage/v1/object/public/blog-images/3212fce1-4595-446c-a9ab-40c9e148cf8a/59ef2ba0-4e77-4ed7-a18f-9c3938064ce2/c9c6cecb-2372-4a28-9fc1-dfc6c1e1b50f.jpeg)The Editor (light)

![null](https://tpwpzkeqppkvywajnezp.supabase.co/storage/v1/object/public/blog-images/3212fce1-4595-446c-a9ab-40c9e148cf8a/59ef2ba0-4e77-4ed7-a18f-9c3938064ce2/cd7b20b9-f8b2-402d-ba53-657319d1de12.jpeg)Settings

![null](https://tpwpzkeqppkvywajnezp.supabase.co/storage/v1/object/public/blog-images/3212fce1-4595-446c-a9ab-40c9e148cf8a/59ef2ba0-4e77-4ed7-a18f-9c3938064ce2/95d68fec-4af2-47fd-9f33-cc94fe5bf43f.jpeg)Settings (light)

![null](https://tpwpzkeqppkvywajnezp.supabase.co/storage/v1/object/public/blog-images/3212fce1-4595-446c-a9ab-40c9e148cf8a/59ef2ba0-4e77-4ed7-a18f-9c3938064ce2/a2ee7ec5-8fd3-4db2-81ec-c893e6758c02.jpeg)Landing page (light)

![null](https://tpwpzkeqppkvywajnezp.supabase.co/storage/v1/object/public/blog-images/3212fce1-4595-446c-a9ab-40c9e148cf8a/59ef2ba0-4e77-4ed7-a18f-9c3938064ce2/713cceb4-419e-40ed-a1f6-08b39ba110dd.jpeg)

### Prerequisites

```
Node >= 16
Yarn >= 1.22.19
Npm >= 8.11.0
```

### Install Project

- Clone the repository:

<!-- -->

```
git clone git@github.com:developeratul/publish-wise-refine.git
```

- Change directory and install dependencies:

<!-- -->

```
cd publish-wise-refine
yarn
```

- Create `.env` file and fill up the credentials

<!-- -->

```
cp .env.example .env
```

- Sync prisma schema with the database:

  ```bash
  yarn push-db
  ```

- If you have followed everything mentioned above properly, you should be able to run:

<!-- -->

```
yarn dev
```

🚀
