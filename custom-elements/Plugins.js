async function loadScript(fileName) {
  if (document.querySelector(`script[src="Plugins/${fileName}"]`)) {
    console.log(`Script already loaded: ${fileName}`);
    return;
  }

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
    return response.ok;
  } catch (error) {
    console.error(`Error checking file existence: ${fileName}`, error);
    return false;
  }
}

function getEnabledPlugins() {
  return JSON.parse(localStorage.getItem("enabledPlugins") || "{}");
}

function saveEnabledPlugins(enabledPlugins) {
  localStorage.setItem("enabledPlugins", JSON.stringify(enabledPlugins));
}

async function loadPlugins(pluginList) {
  const enabledPlugins = getEnabledPlugins();

  for (const [pluginName, fileName] of Object.entries(pluginList)) {
    if (enabledPlugins[pluginName]) {
      try {
        await loadScript(fileName);
      } catch (error) {
        console.error(`Error loading plugin: ${pluginName}`, error);
      }
    }
  }
}

async function createPluginControls(pluginList) {
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

    toggleButton.addEventListener("click", async () => {
      const isEnabled = enabledPlugins[pluginName];
      enabledPlugins[pluginName] = !isEnabled;
      saveEnabledPlugins(enabledPlugins);

      if (!isEnabled) {
        try {
          await loadScript(fileName);
          toggleButton.textContent = "Disable";
        } catch (error) {
          console.error(`Error loading plugin: ${pluginName}`, error);
          enabledPlugins[pluginName] = false;
          saveEnabledPlugins(enabledPlugins);
          toggleButton.textContent = "Enable";
        }
      } else {
        console.log(`Unloading plugin: ${pluginName}. Reloading page...`);
        location.reload();
      }
    });

    pluginDiv.appendChild(label);
    pluginDiv.appendChild(toggleButton);
    controlsContainer.appendChild(pluginDiv);
  }
}

async function initializePlugins() {
  try {
    const response = await fetch("Plugins/pluginList.json");
    const pluginList = await response.json();
    await createPluginControls(pluginList);
    await loadPlugins(pluginList);
  } catch (error) {
    console.error("Error initializing plugins:", error);
  }
}

document.addEventListener("DOMContentLoaded", initializePlugins);