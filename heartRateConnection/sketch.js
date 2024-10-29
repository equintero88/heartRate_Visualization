let mySocket;
let myValue = 0;
const serviceUuid = "0000180D-0000-1000-8000-00805F9B34FB";
const characteristicUuid = "00002a37-0000-1000-8000-00805f9b34fb";

let myBLE;
let myCharacteristic;

function setup() {
  // Configurar WebSocket
  mySocket = new WebSocket("ws://localhost:8080");

  mySocket.onopen = function () {
    console.log("WebSocket is connected");
  };

  // Manejar mensajes recibidos desde el servidor
  mySocket.onmessage = (event) => {
    if (event.data instanceof Blob) {
      // Si los datos son un Blob, conviértelos a texto antes de procesarlos
      const reader = new FileReader();
      reader.onload = function () {
        try {
          const jsonData = JSON.parse(reader.result);
          console.log("Received from server:", jsonData);
        } catch (error) {
          console.error("Error parsing Blob to JSON", error);
        }
      };
      reader.readAsText(event.data);  // Convierte Blob a texto
    } else {
      // Si los datos son texto directamente, intenta procesarlos como JSON
      try {
        const jsonData = JSON.parse(event.data);
        console.log("Received from server:", jsonData);
      } catch (error) {
        console.error("Error parsing message", error);
      }
    }
  };

  mySocket.onclose = function () {
    console.log("WebSocket is closed");
  };

  mySocket.onerror = function (error) {
    console.log("WebSocket error: ", error);
  };

  // Resto del código de tu setup
  myBLE = new p5ble();
  createCanvas(200, 200);
  textSize(20);
  textAlign(CENTER, CENTER);

  const connectButton = createButton("Connect and Start Notifications");
  connectButton.mousePressed(connectAndStartNotify);

  const stopButton = createButton("Stop Notifications");
  stopButton.mousePressed(stopNotifications);
}

function connectAndStartNotify() {
  myBLE.connect(serviceUuid, gotCharacteristics);
}

function gotCharacteristics(error, characteristics) {
  if (error) console.log("error: ", error);

  myCharacteristic = characteristics.find((c) => c.uuid === characteristicUuid);

  if (myCharacteristic) {
    myBLE.startNotifications(myCharacteristic, handleNotifications, "custom");
    console.log("Notificaciones iniciadas en la característica 2A37");
  } else {
    console.log("Característica 2A37 no encontrada.");
  }
}

function handleNotifications(data) {
  myValue = data.getUint16(0);

  // Empaquetar el valor en un JSON y enviarlo por el WebSocket
  const dataToSend = JSON.stringify(myValue);

  if (mySocket.readyState === WebSocket.OPEN) {
    mySocket.send(dataToSend);
    console.log("Datos enviados: ", dataToSend);
  } else {
    console.log("WebSocket no está listo para enviar datos");
  }
}

function stopNotifications() {
  myBLE.stopNotifications(myCharacteristic);
}

function draw() {
  background(250);
  text(myValue, 100, 100);
}
