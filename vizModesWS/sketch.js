let socket;

function setup() {
  createCanvas(400, 400);
  
  socket = new WebSocket('ws://localhost:3000'); // Cambiado al puerto 3000

  socket.onopen = function() {
    console.log("Conectado al servidor websocket en el puerto 3000");
  };

  // Manejar errores de conexión
  socket.onerror = function(error) {
    console.log("Error en la conexión websocket", error);
  };
}

function draw() {
  background(220);

  // Dibujar el primer "botón" con el número 1
  fill(255);
  rect(50, 30, 150, 150); // Posición y ajustada a 30
  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("1", 125, 105);

  // Dibujar el segundo "botón" con el número 2
  fill(255);
  rect(200, 30, 150, 150); // Posición y ajustada a 30
  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("2", 275, 105);

  // Dibujar el tercer "botón" con el número 3 justo debajo de las otras dos
  fill(255);
  rect(125, 190, 150, 150); // Posición y ajustada a 190
  fill(0);
  textSize(32);
  textAlign(CENTER, CENTER);
  text("3", 200, 265);
}

// Detectar cuando se presionan los "botones"
function mousePressed() {
  // Si se hace clic en el primer "botón"
  if (mouseX > 50 && mouseX < 200 && mouseY > 30 && mouseY < 180) {
    enviarValor(1); // Enviar valor 1 al websocket
  }
  // Si se hace clic en el segundo "botón"
  if (mouseX > 200 && mouseX < 350 && mouseY > 30 && mouseY < 180) {
    enviarValor(2); // Enviar valor 2 al websocket
  }
  // Si se hace clic en el tercer "botón"
  if (mouseX > 125 && mouseX < 275 && mouseY > 190 && mouseY < 340) {
    enviarValor(3); // Enviar valor 3 al websocket
  }
}

// Función para enviar valores por el websocket
function enviarValor(valor) {
  if (socket.readyState === WebSocket.OPEN) {
    const jsonMessage = JSON.stringify(valor); // Enviar el JSON con el valor
    socket.send(jsonMessage);  // Enviar el JSON a través del websocket
    console.log('Valor enviado:', jsonMessage);
  } else {
    console.log("La conexión websocket no está abierta");
  }
}
