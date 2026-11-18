import { updateUser, userKey } from "../../core/user-economy.js";
export default {
 id:"pay", command:"pay", aliases:["transfer","تحويل"], category:"Money", description:"Transfer virtual coins to a mentioned member",
 async execute({message,args,reply,context}) {
  const target=message.mentionedJid?.[0]||message.quotedParticipant;
  const amount=Number(args.find(x=>/^\\d+$/.test(x)));
  if(!target||!Number.isSafeInteger(amount)||amount<1||amount>1000000){await reply("الاستخدام: .pay @member <amount>");return;}
  const recipient=String(target).split("@")[0].split(":")[0].replace(/\\D/g,"");
  if(!recipient||recipient===userKey(message)){await reply("المستلم غير صالح.");return;}
  const senderKey=userKey(message), recipientKey=recipient;
  let result;
  await context.runtime.store.transact(data=>{
   data.users||={}; const sender=data.users[senderKey]||(data.users[senderKey]={coins:0});
   const receiver=data.users[recipientKey]||(data.users[recipientKey]={coins:0});
   if((sender.coins||0)<amount){result="رصيدك غير كافٍ.";return;}
   sender.coins-=amount;receiver.coins=(receiver.coins||0)+amount;result=`تم تحويل ${amount} عملة بنجاح.`;
  });
  await reply(result);
 }
};