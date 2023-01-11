import * as cheerio from 'cheerio'
import * as nodemailer from 'nodemailer'
import * as dotenv from 'dotenv'
import fetch from 'node-fetch'
import { actualDate } from './date-provider.js'

//Declare app constant variables

const BOCYL_URL = `https://bocyl.jcyl.es/boletin.do?fechaBoletin=${actualDate}`
const SCRAPE_MAIN_TITLE_ID = '#resultados p'
const MAIL_TEXT = `
    ¡NOTICIA! ¡Noticia sobre bono Alquiler Joven en CyL! 😎 \n
    Revisa el siguiente enlace,por si acaso se me ha pasado algo ${BOCYL_URL}\n\n\n
    Hecho por David Santos Clemente con ❤`
const MAIL_TITLE = '¡NOTICIA! ¡Noticia sobre bono Alquiler Joven en CyL! 😎'

//Get html from url

const res = await fetch(BOCYL_URL)
const html = await res.text()

//Load html with cheerio

const $ = cheerio.load(html)
let existDispositionAboutBonoAlquilerJoven = false; 
$(SCRAPE_MAIN_TITLE_ID).each((i, el) => {
    //If exists any news related to Bono Alquiler Joven, set existDispositionAboutBonoAlquilerJoven to true
    existDispositionAboutBonoAlquilerJoven = $(el).text().includes('Bono Alquiler')
})

//Load .env file
dotenv.config();

//Send transporter of NodeMailer

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { 
        user: process.env.GMAIL_USER, 
        pass: process.env.GMAIL_PASS
    }
})

//Config mailOptions of NodeMailer
const mailOptions = {
    from: process.env.GMAIL_USER,
    to: process.env.GMAIL_SUBSCRIBERS,
    subject: MAIL_TITLE,
    text: MAIL_TEXT
}

//If exists any news related to Bono Alquiler Joven, send email

if(existDispositionAboutBonoAlquilerJoven){
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error at sending mail',error)
        } else {
            console.log('Email sent: ' + info.response)
        }
    })
}
