const http = require("http");
const fs = require("fs");
const url = require("url");
const path = require("path");
const readline = require("readline");

class Vehicle {
  constructor(make, model, year, rentalRate) {
    this.make = make;
    this.model = model;
    this.year = year;
    this.rentalRate = rentalRate;
  }

  displayInfo() {
    console.log(`Make: ${this.make}, Model: ${this.model}, Year: ${this.year}, Rental Rate: $${this.rentalRate}`);
  }

  getType() {
    throw new Error('getType() must be implemented in subclasses');
  }

  toString() {
    return `${this.getType()} ${this.make} ${this.model} ${this.year} ${this.rentalRate}`;
  }

  static fromString(str) {
    const parts = str.split(' ');
    const type = parts[0];
    const make = parts[1];
    const model = parts[2];
    const year = parseInt(parts[3], 10);
    const rate = parseInt(parts[4], 10);

    switch (type) {
      case 'Car':
        return new Car(make, model, year, rate);
      case 'Truck':
        return new Truck(make, model, year, rate);
      case 'Van':
        return new Van(make, model, year, rate);
      default:
        throw new Error('Unknown vehicle type');
    }
  }
}

class Car extends Vehicle {
  getType() {
    return 'Car';
  }

  displayInfo() {
    console.log('Car - ');
    super.displayInfo();
  }
}

class Truck extends Vehicle {
  getType() {
    return 'Truck';
  }

  displayInfo() {
    console.log('Truck - ');
    super.displayInfo();
  }
}

class Van extends Vehicle {
  getType() {
    return 'Van';
  }

  displayInfo() {
    console.log('Van - ');
    super.displayInfo();
  }
}

function saveToFile(vehicles, filename) {
  const data = vehicles.map(vehicle => vehicle.toString()).join('\n');
  try {
    fs.writeFileSync(filename, data);
    console.log(`Data successfully saved to ${filename}`);
  } catch (error) {
    console.error(`Error saving data to file: ${error.message}`);
  }
}

function loadFromFile(filename) {
  if (!fs.existsSync(filename)) {
    return [];
  }

  try {
    const data = fs.readFileSync(filename, 'utf8');
    return data.split('\n').filter(line => line.trim() !== '').map(line => Vehicle.fromString(line.trim()));
  } catch (error) {
    console.error(`Error reading data from file: ${error.message}`);
    return [];
  }
}

function askQuestion(query) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise(resolve => rl.question(query, answer => {
    rl.close();
    resolve(answer);
  }));
}

async function addVehicle(vehicles) {
  const type = await askQuestion('Enter vehicle type (Car, Truck, Van): ');
  const make = await askQuestion('Enter make: ');
  const model = await askQuestion('Enter model: ');
  const year = await askQuestion('Enter year: ');
  const rate = await askQuestion('Enter rental rate: ');

  let vehicle;
  switch (type) {
    case 'Car':
      vehicle = new Car(make, model, parseInt(year, 10), parseInt(rate, 10));
      break;
    case 'Truck':
      vehicle = new Truck(make, model, parseInt(year, 10), parseInt(rate, 10));
      break;
    case 'Van':
      vehicle = new Van(make, model, parseInt(year, 10), parseInt(rate, 10));
      break;
    default:
      console.log('Invalid vehicle type!');
      return;
  }
  vehicles.push(vehicle);
}

async function askToAddAnotherVehicle() {
  const choice = await askQuestion('Do you want to add another vehicle? (y/n): ');
  return choice.toLowerCase() === 'y';
}

async function register(vehicles) {
  saveToFile(vehicles, 'Vehicle_Data.txt');
  console.log('Data saved to Vehicle_Data.txt');

  console.log('Redirecting to next page...');
  process.stdout.write('\x1B[2J\x1B[H');
  console.log('Next page...');
}

function serveStaticFile(filePath, contentType, response) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      response.writeHead(500, { "Content-Type": "text/plain" });
      response.end("500 Internal Server Error");
      return;
    }
    response.writeHead(200, { "Content-Type": contentType });
    response.end(data);
  });
}

const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  if (pathname === "/") {
    serveStaticFile("index.html", "text/html", res);
  } else if (pathname === "/register" && req.method === "POST") {
    let body = "";
    req.on("data", chunk => {
      body += chunk.toString();
    });
    req.on("end", () => {
      const { username, contact } = JSON.parse(body);
      console.log(`Registration received: Username - ${username}, Contact - ${contact}`);
      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ status: "success" }));
    });
  } else if (pathname.startsWith("/static/")) {
    const extname = path.extname(pathname);
    let contentType = "text/plain";
    switch (extname) {
      case ".html":
        contentType = "text/html";
        break;
      case ".js":
        contentType = "text/javascript";
        break;
      case ".css":
        contentType = "text/css";
        break;
      case ".json":
        contentType = "application/json";
        break;
      case ".png":
        contentType = "image/png";
        break;
      case ".jpg":
        contentType = "image/jpg";
        break;
      case ".wav":
        contentType = "audio/wav";
        break;
    }
    serveStaticFile(`.${pathname}`, contentType, res);
  } else {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  }
});

server.listen(80, "127.0.0.1", () => {
  console.log("Listening on port 80");
});

(async function main() {
  try {
    const vehicles = loadFromFile('Vehicle_Data.txt');

    if (vehicles.length > 0) {
      console.log('Loaded vehicles from file:');
      vehicles.forEach(vehicle => vehicle.displayInfo());
    }

    while (true) {
      await addVehicle(vehicles);
      const addAnother = await askToAddAnotherVehicle();

      if (!addAnother) {
        console.log('Vehicle Information:');
        vehicles.forEach(vehicle => vehicle.displayInfo());

        await register(vehicles);
        break;
      }
    }
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
