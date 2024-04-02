// Download the helper library from https://www.twilio.com/docs/node/install
// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require("twilio")(accountSid, authToken);

export const enviarMensaje = async (
  de: string,
  para: string,
  mensaje: string
) => {
  client.messages
    .create({
      // from: `whatsapp:+14155238886`,
      from: `whatsapp:${de}`,
      body: mensaje,
      to: `whatsapp:${para}`,
      // to: `whatsapp:+15005550006`,
    })
    .catch((error: any) => {
      // You can implement your fallback code here}
      throw new Error(error.message);
    });
};
// .then(() => {
//   // Access details about the last request
//   console.log(client.lastRequest.method);
//   console.log(client.lastRequest.url);
//   console.log(client.lastRequest.auth);
//   console.log(client.lastRequest.params);
//   console.log(client.lastRequest.headers);
//   console.log(client.lastRequest.data);

//   // Access details about the last response
//   console.log(client.httpClient.lastResponse.statusCode);
//   console.log(client.httpClient.lastResponse.body);
// })
