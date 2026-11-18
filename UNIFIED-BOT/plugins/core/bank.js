import { updateUser } from "../../core/user-economy.js";
export default [
 { id:"bank", command:"bank", aliases:["account"], category:"Money", description:"Show wallet and bank balance",
   async execute({message,reply,context}) { const u=context.runtime.store.read().users?.[message.senderNumber||message.senderJid]||{}; await reply(`👛 المحفظة: ${u.coins||0}\n🏦 البنك: ${u.bank||0}\n💰 الإجمالي: ${(u.coins||0)+(u.bank||0)}`); } },
 { id:"deposit", command:"deposit", aliases:["ايداع"], category:"Money", description:"Deposit virtual coins into bank",
   async execute({message,args,reply,context}) { const amount=args[0]==="all"?Infinity:Number(args[0]); if(!(amount>0)){await reply("الاستخدام: .deposit <amount|all>");return;} let result; await updateUser(context.runtime.store,message,u=>{const n=Math.min(u.coins||0,amount); if(!n) return result="رصيد المحفظة غير كافٍ.";u.coins-=n;u.bank=(u.bank||0)+n;result=`تم إيداع ${n} عملة. رصيد البنك: ${u.bank}`;}); await reply(result); } },
 { id:"withdraw", command:"withdraw", aliases:["سحب"], category:"Money", description:"Withdraw virtual coins from bank",
   async execute({message,args,reply,context}) { const amount=args[0]==="all"?Infinity:Number(args[0]); if(!(amount>0)){await reply("الاستخدام: .withdraw <amount|all>");return;} let result; await updateUser(context.runtime.store,message,u=>{const n=Math.min(u.bank||0,amount); if(!n) return result="رصيد البنك غير كافٍ.";u.bank-=n;u.coins=(u.coins||0)+n;result=`تم سحب ${n} عملة. رصيد المحفظة: ${u.coins}`;}); await reply(result); } }
];