const { Client } = require('discord.js')
const readline = require('readline')

const BOT_TOKEN = process.env.BOT_TOKEN
const TARGET_UID = process.env.TARGET_UID
const options = {
  intents: [
    'DirectMessages',
    'DirectMessageReactions',
    'DirectMessageTyping',
    'MessageContent',
  ],
}
const client = new Client(options)
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

if (!BOT_TOKEN) throw new Error('BOT_TOKEN is required')
if (!TARGET_UID) throw new Error('TARGET_UID is required')

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
})

client.login(BOT_TOKEN)

promptLog()

rl.on('line', async (input) => {
  if (input === '') {
    await sendMessageToDM(client, TARGET_UID)
    promptLog()
  } else if (input.toLowerCase() === 'q') {
    rl.close()
  } else {
    console.log("Invalid input. Press Enter to proceed or type 'q' to quit.")
  }
})

async function sendMessageToDM(client, targetUID) {
  if (!client.isReady()) throw new Error('Client is not ready')
  if (!targetUID) throw new Error('TARGET_UID is required')

  try {
    const user = await client.users.fetch(targetUID)
    await user.createDM()
    await user.send('Hello!')
    console.log('Message sent!')
  } catch (error) {
    console.error(error)
  }
}

function promptLog() {
  console.log(
    "Do you want to send a DM? Press Enter to proceed or type 'q' to quit.",
  )
}
