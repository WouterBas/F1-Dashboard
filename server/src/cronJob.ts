import cron from "node-cron";
import shell from "shelljs";

console.log("Cron Job Started");

cron.schedule("*/15 * * * 5,6,0", function () {
  console.log("Running Cron Job " + new Date().toLocaleString());
  console.log("---------------------");
  shell.exec("bun seed");
  console.log("---------------------");
  console.log("Cron Job Completed" + new Date().toLocaleString());
});
