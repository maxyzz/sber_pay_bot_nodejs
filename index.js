const { Telegraf } = require('telegraf')
require('dotenv').config()

const bot = new Telegraf(process.env.BOT_TOKEN) 

const getInvoice = (id) => {
  const invoice = {
    chat_id: id, 
    provider_token: process.env.PROVIDER_TOKEN, // token @SberbankPaymentBot 
    start_parameter: 'get_access', // unique param for deep links. if it is empty. then re-addressed copies of sent message will have button "Pay"
    title: 'InvoiceTitle', // name of product, 1-32 symbols 
    description: 'InvoiceDescription', // desc of product, 1-255 symbols
    currency: 'RUB', 
    prices: [{ label: 'Invoice Title', amount: 100 * 100 }], // Divide prices in format JSON 100 kopeek * 100 = 100 RUB
    photo_url: 'https://s3.eu-central-1.wasabisys.com/ghashtag/JavaScriptBot/Unlock.png', // URL for photo of invoices
    photo_width: 500, 
    photo_height: 281, 
    payload: { 
      unique_id: `${id}_${Number(new Date())}`,
      provider_token: process.env.PROVIDER_TOKEN 
    }
  }

  return invoice
}

bot.use(Telegraf.log())

bot.hears('pay', (ctx) => { 
  return ctx.replyWithInvoice(getInvoice(ctx.from.id)) 
})

bot.on('pre_checkout_query', (ctx) => ctx.answerPreCheckoutQuery(true)) 

bot.on('successful_payment', async (ctx, next) => { 
  await ctx.reply('SuccessfulPayment')
})

bot.launch()