import app from './app'

const port = process.env.PORT || 3333

// Only listen when not on Vercel (local/Docker)
if (!process.env.VERCEL) {
  app.listen(port, () => console.log(`⚡️[server]: Server is running at ${port}`))
}

export default app
