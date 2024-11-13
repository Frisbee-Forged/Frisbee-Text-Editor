// This is the main script for the Test Plugin.
console.log("Test Plugin has been loaded successfully!");

const testMessage = document.createElement("div");
testMessage.id = "test-plugin-message";
testMessage.textContent = "Test Plugin is active!";
testMessage.style.position = "fixed";
testMessage.style.bottom = "10px";
testMessage.style.left = "10px";
testMessage.style.padding = "10px";
testMessage.style.backgroundColor = "#333";
testMessage.style.color = "#fff";
testMessage.style.borderRadius = "5px";
document.body.appendChild(testMessage);
