const WebSocket = require('ws');

// Crear el servidor WebSocket en el puerto 3000
const wss = new WebSocket.Server({ port: 3000 });

wss.on('connection', function connection(ws) {
  console.log('Un cliente se ha conectado.');

  // Escuchar los mensajes recibidos desde el cliente
  ws.on('message', function incoming(message) {
    try {
      // Convertir el buffer a texto
      const messageString = message.toString();  
      
      // Parsear el texto como JSON
      const data = JSON.parse(messageString);  
      
      // Mostrar el mensaje JSON parseado en la consola
      console.log('Mensaje JSON recibido del cliente:', data);  

      // Reenviar el mensaje a todos los clientes conectados
      wss.clients.forEach(function each(client) {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify(data));  // Enviar el JSON a todos los clientes conectados
        }
      });
    } catch (error) {
      console.error('Error al parsear el JSON:', error);
    }
  });

  ws.on('close', function close() {
    console.log('El cliente se ha desconectado.');
  });
});

console.log('Servidor WebSocket corriendo en ws://localhost:3000');
