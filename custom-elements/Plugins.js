// Function to dynamically load a script
async function loadScript(url) {
  if (document.querySelector(`script[src="${url}"]`)) {
    console.log(`Script already loaded: ${url}`);
    return;
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.onload = () => {
      console.log(`Loaded script: ${url}`);
      resolve();
    };
    script.onerror = (error) => {
      console.error(`Failed to load script: ${url}`, error);
      reject(new Error(`Failed to load script: ${url}`));
    };
    document.head.appendChild(script);
  });
}

// Function to check if a file exists
async function fileExists(url) {
  try {
    const response = await fetch(url);
    return response.ok;
  } catch (error) {
    console.error(`Error checking file existence: ${url}`, error);
    return false;
  }
}

// Function to get the list of enabled plugins from localStorage
function getEnabledPlugins() {
  return JSON.parse(localStorage.getItem("enabledPlugins") || "{}");
}

// Function to save the list of enabled plugins to localStorage
function saveEnabledPlugins(enabledPlugins) {
  localStorage.setItem("enabledPlugins", JSON.stringify(enabledPlugins));
}

// Function to load plugins based on the saved enabled state
async function loadPlugins(pluginFolders) {
  const enabledPlugins = getEnabledPlugins();

  for (const folderName of pluginFolders) {
    const metadataUrl = `Plugins/${folderName}/Metadata.json`;
    const exists = await fileExists(metadataUrl);

    if (!exists) {
      console.warn(`Metadata file not found for plugin: ${folderName}`);
      continue;
    }

    try {
      const response = await fetch(metadataUrl);
      const metadata = await response.json();
      const pluginName = metadata.name;
      const mainFile = metadata.main;
      const pluginUrl = `${metadata.url.replace(/\/?$/, "/")}${mainFile}`;

      // Automatically load enabled plugins
      if (enabledPlugins[folderName]) {
        console.log(`Auto-loading enabled plugin: ${pluginName}`);
        try {
          await loadScript(pluginUrl);
        } catch (error) {
          console.error(`Error loading plugin: ${pluginName}`, error);
        }
      }
    } catch (error) {
      console.error(`Error loading metadata for plugin: ${folderName}`, error);
    }
  }
}

// Function to create plugin controls in the UI
async function createPluginControls(pluginFolders) {
  try {
    const enabledPlugins = getEnabledPlugins();
    const controlsContainer = document.getElementById("plugin-controls");
    controlsContainer.innerHTML = "";

    for (const pluginFolder of pluginFolders) {
      const metadataPath = `Plugins/${pluginFolder}/Metadata.json`;

      try {
        const metadata = await fetch(metadataPath).then((res) => res.json());

        const { name, version, description, author, main } = metadata;

        const pluginDiv = document.createElement("div");
        pluginDiv.classList.add("plugin-item");

        // Plugin Header
        const header = document.createElement("h3");
        header.textContent = name || pluginFolder;

        // Version
        const versionText = document.createElement("p");
        versionText.textContent = `Version: ${version || "Unknown"}`;

        // Description
        const descriptionText = document.createElement("p");
        descriptionText.textContent = description || "No description provided.";

        // Author
        const authorText = document.createElement("p");
        authorText.textContent = `Author: ${author || "Unknown"}`;

        // Toggle Button
        const toggleButton = document.createElement("button");
        toggleButton.classList.add("plugin-toggle");
        let isEnabled = enabledPlugins[pluginFolder];
        toggleButton.textContent = isEnabled ? "Disable" : "Enable";

        // Toggle button click handler
        toggleButton.addEventListener("click", async () => {
          const exists = await fileExists(`Plugins/${pluginFolder}/${main}`);
          if (!exists) {
            console.error(`Cannot enable plugin: ${pluginFolder}/${main} does not exist.`);
            delete enabledPlugins[pluginFolder];
            saveEnabledPlugins(enabledPlugins);
            toggleButton.textContent = "Enable";
            return;
          }

          // Toggle plugin state
          isEnabled = !isEnabled;
          enabledPlugins[pluginFolder] = isEnabled;
          saveEnabledPlugins(enabledPlugins);
          toggleButton.textContent = isEnabled ? "Disable" : "Enable";

          if (!isEnabled) {
            // Confirm reload to disable the plugin
            const confirmReload = confirm("Reload the page to disable the plugin?");
            if (confirmReload) {
              location.reload();
            } else {
              // Revert the button state if the user cancels the reload
              isEnabled = true;
              enabledPlugins[pluginFolder] = true;
              saveEnabledPlugins(enabledPlugins);
              toggleButton.textContent = "Disable";
            }
          } else {
            // Load the script if enabling without reload
            await loadScript(`Plugins/${pluginFolder}/${main}`);
          }
        });

        // Append elements to the UI
        pluginDiv.appendChild(header);
        pluginDiv.appendChild(versionText);
        pluginDiv.appendChild(descriptionText);
        pluginDiv.appendChild(authorText);
        pluginDiv.appendChild(toggleButton);

        controlsContainer.appendChild(pluginDiv);
      } catch (error) {
        console.error(`Failed to load metadata for plugin: ${pluginFolder}`, error);
      }
    }
  } catch (error) {
    console.error("Error creating plugin controls:", error);
  }
}

// Function to initialize plugins on page load
async function initializePlugins() {
  try {
    const response = await fetch("Plugins/pluginList.json");
    const pluginFolders = await response.json();

    // Ensure plugins are loaded based on their saved state
    await loadPlugins(pluginFolders);
    await createPluginControls(pluginFolders);
  } catch (error) {
    console.error("Error initializing plugins:", error);
  }
}

// Initialize plugins when the DOM content is fully loaded
document.addEventListener("DOMContentLoaded", initializePlugins);