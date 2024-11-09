function loadScript(fileName) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = `Plugins/${fileName}`;
    script.onload = () => {
      console.log(`Loaded: ${fileName}`);
      resolve();
    };
    script.onerror = (error) => {
      console.error(`Failed to load: ${fileName}`, error);
      reject(new Error(`Failed to load script: ${fileName}`));
    };
    document.head.appendChild(script);
  });
}

async function fileExists(fileName) {
  try {
    const response = await fetch(`Plugins/${fileName}`);
    // Check if the response is successful (status 200)
    return response.ok;
  } catch (error) {
    console.error(`Error checking file existence: ${fileName}`, error);
    return false;
  }
}

function getEnabledPlugins() {
  const enabledPlugins = localStorage.getItem("enabledPlugins");
  return enabledPlugins ? JSON.parse(enabledPlugins) : {};
}

function saveEnabledPlugins(enabledPlugins) {
  localStorage.setItem("enabledPlugins", JSON.stringify(enabledPlugins));
}

async function loadPlugins() {
  try {
    const response = await fetch("Plugins/pluginList.json");
    const pluginList = await response.json();
    const enabledPlugins = getEnabledPlugins();

    for (const [pluginName, fileName] of Object.entries(pluginList)) {
      if (enabledPlugins[pluginName]) {
        const exists = await fileExists(fileName);
        if (!exists) {
          console.warn(`Plugin file not found: ${fileName}. Disabling plugin: ${pluginName}`);
          delete enabledPlugins[pluginName];
          saveEnabledPlugins(enabledPlugins);
          continue;
        }

        try {
          await loadScript(fileName);
        } catch (error) {
          console.error(`Error loading plugin: ${pluginName}`, error);
        }
      }
    }
  } catch (error) {
    console.error("Error loading plugins:", error);
  }
}

// Function to create plugin controls UI
async function createPluginControls() {
  try {
    const response = await fetch("Plugins/pluginList.json");
    const pluginList = await response.json();
    const enabledPlugins = getEnabledPlugins();

    const controlsContainer = document.getElementById("plugin-controls");
    controlsContainer.innerHTML = "";

    for (const [pluginName, fileName] of Object.entries(pluginList)) {
      const exists = await fileExists(fileName);
      if (!exists) {
        console.warn(`Plugin file not found: ${fileName}. Skipping plugin: ${pluginName}`);
        continue;
      }

      const pluginDiv = document.createElement("div");
      pluginDiv.classList.add("plugin-item");

      const label = document.createElement("span");
      label.classList.add("plugin-name");
      label.textContent = pluginName;

      const toggleButton = document.createElement("button");
      toggleButton.classList.add("plugin-toggle");
      toggleButton.textContent = enabledPlugins[pluginName] ? "Disable" : "Enable";

      // Toggle button click handler
      toggleButton.addEventListener("click", async () => {
        const fileExistsCheck = await fileExists(fileName);
        if (!fileExistsCheck) {
          console.error(`Cannot enable plugin: ${fileName} does not exist.`);
          delete enabledPlugins[pluginName];
          saveEnabledPlugins(enabledPlugins);
          toggleButton.textContent = "Enable";
          return;
        }

        enabledPlugins[pluginName] = !enabledPlugins[pluginName];
        saveEnabledPlugins(enabledPlugins);
        toggleButton.textContent = enabledPlugins[pluginName] ? "Disable" : "Enable";

        // Update the UI without full page reload
        createPluginControls();
      });

      pluginDiv.appendChild(label);
      pluginDiv.appendChild(toggleButton);
      controlsContainer.appendChild(pluginDiv);
    }
  } catch (error) {
    console.error("Error creating plugin controls:", error);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  createPluginControls();
  loadPlugins();
});