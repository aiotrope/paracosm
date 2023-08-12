process.on('unhandledRejection', (reason: Error | any) => {
  console.error(`Unhandled Rejection: ${reason.message || reason}`)

  throw new Error(reason.message || reason)
})

process.on('uncaughtException', (error: Error) => {
  console.log(`Uncaught Exception: ${error.message}`)

  throw new Error(error.message)
})
