/*******************************
  Multi-Drive-Browser code
*******************************/

// This function initializes a single Drive browser instance
// inside the given `containerEl` (i.e., the <div> that has data-apikey, data-folder, etc.).
function initDriveBrowser(containerEl) {
  /* --------------------------------------------------------
    1) EXTRACT DATA ATTRIBUTES
  -------------------------------------------------------- */
  const apiKey = containerEl.dataset.apikey;
  const startFolder = containerEl.dataset.folder || "root";

  // Keep our state (folder stack, ascending order, etc.) in an object:
  const state = {
    folderStack: [startFolder],
    ascending: true,
    textIcons: false,
    // Colors & styling
    primary: "#ffffff",
    secondary: "#f2f2f2",
    tertiary: "#000000",
    iconColor: "black",
    fontStyle: "'Roboto', sans-serif",
  };

  /* --------------------------------------------------------
    2) BUILD THE DOM INSIDE containerEl
  -------------------------------------------------------- */
  // Clear out anything in containerEl so we can build our UI from scratch:
  containerEl.innerHTML = "";

  // Give containerEl a class so we can style it (no ID collisions).
  containerEl.classList.add("drive-browser-component");
  containerEl.style.display = "flex";
  containerEl.style.flexDirection = "column";
  containerEl.style.marginBottom = "10px";
  containerEl.style.backgroundColor = "transparent";
  containerEl.style.color = state.iconColor;
  containerEl.style.fontFamily = state.fontStyle;
  // etc. If you want more inline styling, do it here.

  // Create sub-elements for the “header”, “files area”, “footer”, etc.
  const uiHeader = document.createElement("div");
  uiHeader.classList.add("ui-header");
  uiHeader.style.display = "flex";
  uiHeader.style.justifyContent = "space-between";
  uiHeader.style.margin = "10px 0";
  containerEl.appendChild(uiHeader);

  // Path container
  const pathContainer = document.createElement("div");
  pathContainer.classList.add("drive-path");
  pathContainer.style.display = "flex";
  pathContainer.style.alignItems = "center";
  pathContainer.style.width = "40%";
  uiHeader.appendChild(pathContainer);

  // Search & icons container
  const searchAndIcons = document.createElement("div");
  searchAndIcons.classList.add("search-icons");
  searchAndIcons.style.display = "flex";
  searchAndIcons.style.justifyContent = "flex-end";
  searchAndIcons.style.width = "60%";
  uiHeader.appendChild(searchAndIcons);

  // The main body container
  const uiBody = document.createElement("div");
  uiBody.classList.add("ui-file-body");
  uiBody.style.padding = "10px";
  containerEl.appendChild(uiBody);

  // Folders row
  const foldersContainer = document.createElement("div");
  foldersContainer.classList.add("folders-container");
  foldersContainer.style.display = "flex";
  foldersContainer.style.flexWrap = "wrap";
  foldersContainer.style.marginBottom = "20px";
  uiBody.appendChild(foldersContainer);

  // Files row
  const filesContainer = document.createElement("div");
  filesContainer.classList.add("files-container");
  filesContainer.style.display = "flex";
  filesContainer.style.flexWrap = "wrap";
  uiBody.appendChild(filesContainer);

  // Footer area
  const uiFooter = document.createElement("div");
  uiFooter.classList.add("ui-footer");
  uiFooter.style.display = "flex";
  uiFooter.style.justifyContent = "flex-end";
  uiFooter.style.paddingTop = "10px";
  uiFooter.style.paddingBottom = "10px";
  containerEl.appendChild(uiFooter);

  const downloadButton = document.createElement("button");
  downloadButton.classList.add("download-btn");
  downloadButton.innerHTML = 'DOWNLOAD <i class="fa-sharp fa-solid fa-download"></i>';
  downloadButton.style.height = "40px";
  downloadButton.style.color = "#f2f2f2"; // or your tertiary color
  downloadButton.disabled = true; // start disabled
  uiFooter.appendChild(downloadButton);

  /* --------------------------------------------------------
    3) HELPER FUNCTIONS (scoped inside initDriveBrowser)
  -------------------------------------------------------- */

  // Example: fetch folder data from Google
  async function loadDriveFolder(folderId) {
    const apiUrl = `https://www.googleapis.com/drive/v3/files?q="${folderId}"+in+parents&key=${apiKey}&fields=files(id,name,mimeType,thumbnailLink,webViewLink)`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      // We have data.files => array of files/folders
      renderFolders(data.files);
      renderFiles(data.files);
    } catch (err) {
      console.error("Error loading folder:", err);
    }
  }

  function renderFolders(fileList) {
    // Clear existing
    foldersContainer.innerHTML = "";
    // If we’re deeper than 1 folder, add “Back” button
    if (state.folderStack.length > 1) {
      const backDiv = document.createElement("div");
      backDiv.classList.add("folder-tile", "back-folder");
      backDiv.textContent = "Previous Folder";
      backDiv.onclick = handleFolderBack;
      foldersContainer.appendChild(backDiv);
    }

    // Filter for subfolders
    const subfolders = fileList.filter((f) => f.mimeType === "application/vnd.google-apps.folder");
    subfolders.forEach((folder) => {
      const folderDiv = document.createElement("div");
      folderDiv.classList.add("folder-tile");
      folderDiv.textContent = folder.name;
      // On click, we push the new folder onto stack
      folderDiv.onclick = () => handleFolderChange(folder.id);
      foldersContainer.appendChild(folderDiv);
    });
  }

  function renderFiles(fileList) {
    // Clear existing
    filesContainer.innerHTML = "";

    // Filter out only non-folder
    const justFiles = fileList.filter((f) => f.mimeType !== "application/vnd.google-apps.folder");

    // (Optional) Sorting logic if you want ascending vs descending
    // Example:
    justFiles.sort((a, b) => {
      if (state.ascending) {
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
      } else {
        return b.name.toLowerCase().localeCompare(a.name.toLowerCase());
      }
    });

    justFiles.forEach((file) => {
      const fileCard = document.createElement("div");
      fileCard.classList.add("file-tile");
      fileCard.style.width = "215px";
      fileCard.style.height = "250px";

      // file preview
      const preview = document.createElement("img");
      preview.src = file.thumbnailLink;
      preview.onclick = () => window.open(file.webViewLink, "_blank");
      fileCard.appendChild(preview);

      // name area
      const nameArea = document.createElement("div");
      nameArea.textContent = file.name;
      fileCard.appendChild(nameArea);

      // checkbox (or “select”)
      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.onchange = () => setDownloadButtonState();
      fileCard.appendChild(checkbox);

      // or a Download button
      const downloadBtn = document.createElement("button");
      downloadBtn.textContent = "DL";
      downloadBtn.onclick = () => downloadSingleFile(file.id, file.name);
      fileCard.appendChild(downloadBtn);

      filesContainer.appendChild(fileCard);
    });
  }

  // Manage folder changes
  function handleFolderChange(folderId) {
    state.folderStack.push(folderId);
    loadDriveFolder(folderId);
  }

  function handleFolderBack() {
    if (state.folderStack.length > 1) {
      // pop
      state.folderStack.pop();
      const prevFolder = state.folderStack[state.folderStack.length - 1];
      loadDriveFolder(prevFolder);
    }
  }

  // Download single file
  async function downloadSingleFile(fileId, fileName) {
    const url = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${apiKey}`;
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Download failed:", err);
    }
  }

  // Called whenever a checkbox changes.  If at least one is checked, enable “DOWNLOAD MULTI”.
  function setDownloadButtonState() {
    const checks = filesContainer.querySelectorAll('input[type="checkbox"]');
    const atLeastOne = Array.from(checks).some((c) => c.checked);
    downloadButton.disabled = !atLeastOne;
    // color styling if needed
    downloadButton.style.backgroundColor = atLeastOne ? state.tertiary : "transparent";
  }

  // Download multiple
  async function handleDownloadAll() {
    const checks = filesContainer.querySelectorAll('input[type="checkbox"]');
    for (let c of checks) {
      if (c.checked) {
        // Possibly you do the same single-file logic
        // or you can batch them into a zip, etc.
        // For demonstration, calling single at a time:
        const fileName = "UnknownName"; // you’d keep name in a data attribute
        await downloadSingleFile(c.value, fileName);
      }
    }
  }
  downloadButton.onclick = handleDownloadAll;

  /* --------------------------------------------------------
    4) INITIAL LOAD
  -------------------------------------------------------- */
  loadDriveFolder(startFolder);
}

/**************************************
  MAKE IT WORK FOR MULTIPLE <div>s
**************************************/

// On DOMContentLoaded, find all .drive-browser elements
document.addEventListener("DOMContentLoaded", () => {
  const allDriveBrowsers = document.querySelectorAll(".drive-browser");
  allDriveBrowsers.forEach((div) => {
    initDriveBrowser(div);
  });
});
