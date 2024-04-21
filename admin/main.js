// import { data } from "./data.js";

// // jeddah
// const session = 9476;
// const start = "2024-03-08T18:03:15.662000";
// const end = "2024-03-08T18:04:43.5";

//melbourne
const session = 9484;
const start = "2024-03-23T05:58:15.936000";
const end = "2024-03-23T05:59:32.2";

// //Sakhir
// const session = 9468;
// const start = "2024-03-01T16:59:09.939000";
// const end = "2024-03-01T17:00:39.2";

async function getTrackData() {
  const response = await fetch(
    `https://api.openf1.org/v1/location?date>=${start}&date<=${end}&session_key=${session}&driver_number=1`
  );
  const data = await response.json();
  return data;
}

const data = await getTrackData();

const minX = Math.min(...data.map((loc) => loc.x));
const minY = Math.min(...data.map((loc) => loc.y));
const maxX = Math.max(...data.map((loc) => loc.x)) + Math.abs(minX);
const maxY = Math.max(...data.map((loc) => loc.y)) + Math.abs(minY);

console.log("min max", minX, minY, maxX, maxY);

const aspectRatio = maxX / maxY;
const scale = maxY / (2048 - 50);

const points = data.map((loc) => {
  return {
    x: (loc.x + Math.abs(minX)) / scale + 25,
    y: (loc.y + Math.abs(minY)) / scale + 25,
  };
});

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

ctx.canvas.height = 2048;
ctx.canvas.width = 2048 * aspectRatio + 50;

console.log("image size", ctx.canvas.width, ctx.canvas.height);

// move to the first point
ctx.moveTo(points[0].x, points[0].y);

for (var i = 1; i < points.length - 2; i++) {
  var xc = (points[i].x + points[i + 1].x) / 2;
  var yc = (points[i].y + points[i + 1].y) / 2;
  ctx.quadraticCurveTo(points[i].x, points[i].y, xc, yc);
}

// curve through the last two points
ctx.quadraticCurveTo(
  points[i].x,
  points[i].y,
  points[i + 1].x,
  points[i + 1].y
);

ctx.lineWidth = 15;
ctx.strokeStyle = "whitesmoke";
ctx.closePath();

ctx.stroke();

// var image = canvas
//   .toDataURL("image/webp")
//   .replace("image/webp", "image/octet-stream"); // here is the most important part because if you dont replace you will get a DOM 18 exception.

// window.location.href = image; // it will save locally
