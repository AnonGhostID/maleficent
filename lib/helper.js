const fs = require('fs');
const chalk = require('chalk');
const fetch = require('node-fetch');
const axios = require('axios');
const cheerio = require('cheerio');
const { exec } = require("child_process");
const util = require('util'), { format } = require('util');
const colors = require('colors/safe.js');
const moment = require("moment-timezone");
module.exports = helper = async (m, { 
   conn, 
   store
}) => {
   const body = (m.mtype === 'conversation') ? m.message.conversation : (m.mtype == 'imageMessage') ? m.message.imageMessage.caption : (m.mtype == 'videoMessage') ? m.message.videoMessage.caption : (m.mtype == 'extendedTextMessage') ? m.message.extendedTextMessage.text : (m.mtype == 'buttonsResponseMessage') ? m.message.buttonsResponseMessage.selectedButtonId : (m.mtype == 'listResponseMessage') ? m.message.listResponseMessage.singleSelectReply.selectedRowId : (m.mtype == 'templateButtonReplyMessage') ? m.message.templateButtonReplyMessage.selectedId : (m.mtype == 'interactiveResponseMessage') ? JSON.parse(m.msg.nativeFlowResponseMessage.paramsJson).id : (m.mtype == 'templateButtonReplyMessage') ? m.msg.selectedId : (m.mtype === 'messageContextInfo') ? (m.message.buttonsResponseMessage?.selectedButtonId || m.message.listResponseMessage?.singleSelectReply.selectedRowId || m.text) : ''
   const budy = (typeof m.text == 'string' ? m.text : '')
   const type = Object.keys(m.message)[0];   
   const isPrefix = ['.', ',', '#', '?'];
   const age = m.sender.split("@")[0].substring(m.sender.split("@")[0].length - 2);   
   const cmd = body.slice(1).trim().split(/ +/).shift().toLowerCase()
   const args = body.trim().split(/ +/).slice(1)
   const text = args.join(' ');
   const pushname = m.pushName || setting.botName.trim() || m.sender.split('@')[0];
   const botNumber = conn.decodeJid(conn.user.id);
   const isMe = botNumber.split('@')[0];
   const isOwner = [...setting.ownerNumber, isMe].map(num => `${num}@s.whatsapp.net`).includes(m.sender);
   const quoted = m.quoted ? m.quoted : m
   const { Format, Connect } = require('utils-mf');
   const mime = (quoted.m || quoted).mimetype || ''
   const groupMetadata = m.isGroup ? await conn.groupMetadata(m.chat).catch(e => {}) : ''
   const groupId = m.isGroup ? groupMetadata.id : ''
   const groupName = m.isGroup ? groupMetadata.subject : ''
   const groupDesc = m.isGroup ? groupMetadata.desc : ''
   const participants = m.isGroup ? groupMetadata.participants : ''
   const groupAdmins = m.isGroup ? participants.filter(v => v.admin !== null).map(v => v.id) : ''
   const groupOwner = m.isGroup ? groupMetadata.owner : '';
   const isBotAdmins = m.isGroup ? groupAdmins.includes(botNumber) : false
   const isAdmins = m.isGroup ? groupAdmins.includes(m.sender) : false
   const mentionByTag = type == "extendedTextMessage" && m.message.extendedTextMessage.contextInfo != null ? m.message.extendedTextMessage.contextInfo.mentionedJid : []
   const mentionByReply = type == "extendedTextMessage" && m.message.extendedTextMessage.contextInfo != null ? m.message.extendedTextMessage.contextInfo.participant || "" : ""
   const index = isPrefix.find(v => body.startsWith(v)); 
   const mention = typeof(mentionByTag) == 'string' ? [mentionByTag] : mentionByTag; var command; var prefix = index;
   mention != undefined ? mention.push(mentionByReply) : []
   const jam = moment.tz('asia/jakarta').format('HH:mm:ss')
   const tanggal = moment().tz("Asia/Jakarta").format("ll")
   const suasana = moment(Date.now()).tz('Asia/Jakarta').locale('id').format('a')
   const time = moment(new Date()).format("HH:mm");   
   moment.tz.setDefault("Asia/Jakarta").locale("id");
   global.waktu = { tanggal, jam, suasana, time };   
   const mentionUser = mention != undefined ? mention.filter(n => n) : []
   const users = global.db.users[m.sender] ? global.db.users[m.sender] : null
   const isNumber = x => typeof x === 'number' && !isNaN(x); if (prefix) command = body.slice(1).trim().split(/ +/).shift().toLowerCase();
   if (global.db) global.defaultDatabase;
   if (typeof users !== 'object') global.db.users[m.sender] = {}
   if (users) {
      if (!('name' in users)) users.name = pushname
      if (!('registered' in users)) users.registered = false
      if (!('registeredTime' in users)) users.registeredTime = ''
      if (!('umur' in users)) users.umur = ''
      if (!('seri' in users)) users.seri = ''
      if (!('premium' in users)) users.premium = false
      if (!('premiumTime' in users)) users.premiumTime = ''
      if (!('banned' in users)) users.banned = false
      if (!('bannedReason' in users)) users.bannedReason = ''
      if (!isNumber(users.limit)) users.limit = 20
      if (!isNumber(users.kupon)) users.kupon = 5
      if (!isNumber(users.uang)) users.uang = 1000
      if (!isNumber(users.hitCmd)) users.hitCmd = 0
      if (!('notes' in users)) users.notes = ''
      if (!('lastClaim' in users)) users.lastClaim = ''
      if (!('lastHour' in users)) users.lastHour = ''
      if (!('lastUang' in users)) users.lastUang = ''
      if (!('lastKupon' in users)) users.lastKupon = ''
      if (!isNumber(users.afkTime)) users.afkTime = -1
      if (!('afkReason' in users)) users.afkReason = ''
    } else {
      global.db.users[m.sender] = {
         name: pushname,
         registered: false,
         registeredTime: '',
         umur: '',
         seri: '',
         premium: false,
         premiumTime: '',
         banned: false,
         bannedReason: '',
         limit: 20,
         kupon: 5,
         uang: 1000,
         hitCmd: 0,
         notes: '',
         lastClaim: '',
         lastHour: '',
         lastUang: '',
         lastKupon: '',
         afkTime: -1,
         afkReason: ''         
      }
   }   
   const groups = global.db.chats[groupId];
   if (typeof groups !== 'object') global.db.chats[groupId] = {}
   if (groups) {
      if (!('name' in groups)) groups.name = groupName
      if (!('welcome' in groups)) groups.welcome = true
      if (!('antilink' in groups)) groups.antilink = true
      if (!('mute' in groups)) groups.mute = false
      if (!('viewOnce' in groups)) groups.viewOnce = true
      if (!('antiToxic' in groups)) groups.antiToxic = true
      if (!('description' in groups)) groups.description = groupDesc
      if (!('welcomeCaption' in groups)) groups.welcomeCaption = setting.group.welcome
      if (!('byeCaption' in groups)) groups.byeCaption = setting.group.bye
   } else {
      global.db.chats[groupId] = {
         name: groupName,
         welcome: true,
         antilink: true,
         mute: false,
         viewOnce: true,
         antiToxic: true,
         description: groupDesc,
         welcomeCaption: setting.group.welcome,
         byeCaption: setting.group.bye
      }
   }
   const settings = global.db.settings
   if (typeof settings !== 'object') global.db.settings = {}
   if (settings) {
      if (!isNumber(settings.menu_type)) settings.menu_type = 2
   } else {
      global.db.settings = {
         menu_type: 2
      }
   }
   const image_daftar = 'https://telegra.ph/file/ab9beaa8589f6af8887e0.jpg'
   const name_daftar = pushname || 'Setan' || `${m.sender.split("@")[0]}`;
   const text_daftar = '*Pendaftaran*'
   const button_daftar = [ 
      ['Daftar Otomatis', `.daftar ${name_daftar}.${age}`], 
      ['Daftar Manual', '.daftar'] 
   ]
   const isPremium = db.users[m.sender].premium || isOwner;
   const extra = { conn, prefix, command, text, mime, args, cmd, quoted, groupName, participants, groupAdmins, mentionUser, mentionByReply, Format, budy, isAdmins, isOwner, isPremium, store };
   const register = { image_daftar, text_daftar, button_daftar };
   Connect(m, extra, register);
   Format.Logger(m, { conn, colors, time, chalk, pushname, groupName, body }); 
   if (budy.startsWith('>') || budy.startsWith('©')) {
      if (!isOwner || m.isBaileys) return
      try {
         m.reply(`evaling...`)
         await m.reply(util.format(await eval(`(async () => { ${budy.slice(2)} })()`)))
      } catch (e) {
         return await m.reply(util.format(e))
      }
   };
   if (budy.startsWith('=>') || budy.startsWith('->') || budy.startsWith('~>')) {
      if (!isOwner || m.isBaileys) return
      try {
         await m.reply(util.format(await eval(`(async () => { return ${budy.slice(3)} })()`)));
      } catch (e) {
         return await m.reply(String(e));
      }
   };
   if (budy.startsWith('$') || budy.startsWith('%') || budy.startsWith('&')) {
      if (!isOwner || m.isBaileys) return
      try {
         m.reply(`executing...`);
         await exec(budy.slice(2), async (error, stdout) => {
            if (error) return await m.reply('' + JSON.stringify(error, null, 2) + '\n\n' + stdout);
            if (stdout) return await m.reply(stdout);
         });
      } catch (error) {
         return await m.reply(`${error}`);
      }
   }
};
const file = require.resolve(__filename);
fs.watchFile(file, () => {
   console.log(chalk.redBright(`Updated ${__filename}`))
   delete require.cache[file]
   require(file)
})