import comjs from '../comfun/com.js';
export default {

  send(value)
  {
      let ws = comjs.linknode();
       ws.onopen = function (e) {
         console.log("链接服务器成功send");
         //console.log("that.contentText is", "我发送消息");
         ws.send(value);
       };
  },

   get()
   {
      var result = -1;
       let ws = comjs.linknode();
       ws.onopen = function (e) {
         console.log("链接服务器成功get");

       };
       ws.onmessage = function (e) {
         console.log("读取到的===",e.data)
         if(e.data !=undefined){
           result = e.data;
         }

       }

       return result;
   },

   linknode()
   {
     let ws = new WebSocket("ws://39.100.30.226:3000");
     return ws;
   }

}
