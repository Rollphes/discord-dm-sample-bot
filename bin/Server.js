const express = require('express')
const { EventEmitter } = require('events')

class Server extends EventEmitter {
  constructor() {
    super()
    this.app = express()
    this.PORT = process.env.PORT || 3000
    this.CLIENT_ID = process.env.CLIENT_ID
    this.CLIENT_SECRET = process.env.CLIENT_SECRET

    if (!this.CLIENT_ID) throw new Error('CLIENT_ID is required')
    if (!this.CLIENT_SECRET) throw new Error('CLIENT_SECRET is required')
  }

  start() {
    this.app.get('/', async (req, res) => {
      const { code } = req.query

      if (!code) {
        console.error('-- Code is required')
        return res.status(400).send('Code is required')
      }

      const oauthData = await this.fetchOauthData(code)
      if ('error' in oauthData) {
        console.error('-- Cannot get token --')
        console.error(oauthData)
        return res.status(400).send(oauthData)
      }

      const userData = await this.fetchUserData(oauthData)
      if ('code' in userData && 'message' in userData) {
        console.error('-- Cannot get user data --')
        console.error(userData)
        return res.status(400).send(userData)
      }

      this.emit('resisted', userData)
      res.send(
        '通知登録頂きありがとうございます！<br>あなたのDMにBOTからDMを送信しましたのでご確認ください！',
      )
    })

    this.app.listen(this.PORT, () => {
      console.log(`Server is running on http://localhost:${this.PORT}`)
    })
  }

  async fetchOauthData(code) {
    const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
      method: 'POST',
      body: new URLSearchParams({
        client_id: this.CLIENT_ID,
        client_secret: this.CLIENT_SECRET,
        code: code,
        grant_type: 'authorization_code',
        redirect_uri: `http://localhost:${this.PORT}`,
        scope: 'identify',
      }).toString(),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return await tokenRes.json()
  }

  async fetchUserData(oauthData) {
    const userRes = await fetch('https://discord.com/api/users/@me', {
      headers: {
        authorization: `${oauthData.token_type} ${oauthData.access_token}`,
      },
    })
    return await userRes.json()
  }
}

module.exports = { Server }
