const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, delay } = require("@whiskeysockets/baileys");
const pino = require("pino");

async function start(){
 const PHONE = process.env.PHONE_NUMBER;
 if(!PHONE){ console.log("❌ ضيف PHONE_NUMBER في Variables"); return; }
 const { state, saveCreds } = await useMultiFileAuthState("session_pair");
 const sock = makeWASocket({ logger: pino({level:"silent"}), auth: state, printQRInTerminal: false, browser: ["WAD SALHA VIP","Chrome","1.0"] });
 sock.ev.on("creds.update", saveCreds);
 if(!sock.authState.creds.registered){
   await delay(3000);
   try{
     const code = await sock.requestPairingCode(PHONE);
     console.log(`\n\n👑👑👑 كود الاقتران حقك: ${code} 👑👑👑\nافتح واتساب > الاعدادات > الاجهزة المرتبطة > ربط جهاز > ربط برقم هاتف > اكتب الكود\n\n`);
   }catch(e){ console.log("خطأ في طلب الكود:", e.message); }
 }
 sock.ev.on("connection.update", async (u)=>{
   if(u.connection==="open") console.log("✅ WAD SALHA VIP اشتغل 24 ساعة!");
   if(u.connection==="close"){
     const reason = u.lastDisconnect?.error?.output?.statusCode;
     if(reason!= 401) start(); else console.log("❌ الجلسة انتهت");
   }
 });
 sock.ev.on("messages.upsert", async ({messages})=>{
   const msg = messages[0]; if(!msg.message || msg.key.fromMe) return;
   const txt = msg.message.conversation || msg.message.extendedTextMessage?.text || "";
   if(txt.trim().toLowerCase()===".الاوامر"){
     await sock.sendMessage(msg.key.remoteJid,{text:"👑 WAD SALHA VIP ULTRA - 17 قسم شغالة\n\n.tv رابط - تحميل تيك توك\n.المطور - معلومات\n\nالبوت شغال 24 ساعة في Railway ✅"});
   }
 });
}
start();
