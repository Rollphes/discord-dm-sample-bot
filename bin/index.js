const { Client } = require('discord.js')
const { Server } = require('./Server')

const BOT_TOKEN = process.env.BOT_TOKEN
const options = {
  intents: [
    'DirectMessages',
    'DirectMessageReactions',
    'DirectMessageTyping',
    'MessageContent',
  ],
}
const client = new Client(options)
const webServer = new Server()

if (!BOT_TOKEN) throw new Error('BOT_TOKEN is required')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

webServer.on('resisted', async (userData) => {
  try {
    const user = await client.users.fetch(userData.id)
    await user.createDM()
    await user.send('Hello!')
    console.log('Message sent!')
  } catch (error) {
    console.error(error)
  }
})

webServer.start()
client.login(BOT_TOKEN)
