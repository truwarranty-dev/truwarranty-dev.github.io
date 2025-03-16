// Wrap everything in an IIFE (Immediately Invoked Function Expression)
// so we don't pollute the global scope.
(() => {

  /**
   * Initialize one Google Drive file-browser inside a given container element.
   * @param {HTMLElement} container - The <div> element with data-apikey and data-folder.
   */
  function initGoogleDriveBrowser(container) {
    // -----------------------------
    // 1) Local state & config
    // -----------------------------
    let arrayPath = [ container.dataset.folder ];
    let ascending = true;
    let textIcons = false;
    let primary = '#ffffff';
    let secondary = '#f2f2f2';
    let tertiary = '#000000';
    let iconColor = 'black';
    let fontStyle = "'Roboto', sans-serif";

    // We'll store any XHR references here if needed
    let xhr = [];
    let resizeStop = null;

    // -----------------------------
    // 2) Create DOM structure
    //    (Instead of using a single "googDiv", we use "container")
    // -----------------------------
    container.style.setProperty('display', 'flex', 'important');
    container.style.setProperty('flex-direction', 'column', 'important');
    container.style.outline = true;
    container.style.setProperty('background-color', 'transparent', 'important');
    container.style.setProperty('margin-bottom', '10px', 'important');
    container.style.color = 'black';
    container.style.fontFamily = fontStyle;

    // ========== UI HEADER ==========
    const uiHeader = document.createElement('div');
    container.appendChild(uiHeader);
    uiHeader.setAttribute('class', 'ui-header');
    uiHeader.style.setProperty('display', 'flex', 'important');
    uiHeader.style.setProperty('alignItems', 'center', 'important');
    uiHeader.style.setProperty('margin-top', '10px', 'important');
    uiHeader.style.setProperty('margin-bottom', '10px', 'important');
    uiHeader.style.setProperty('padding-left', '5px', 'important');
    uiHeader.style.setProperty('padding-right', '0px', 'important');

    // Filepath
    const filepath = document.createElement('div');
    uiHeader.appendChild(filepath);
    filepath.setAttribute('class', 'filepath');
    filepath.style.display = 'flex';
    filepath.style.setProperty('flex-direction', 'row', 'important');
    filepath.style.setProperty('align-items', 'center', 'important');
    filepath.style.width = '40%';
    filepath.style.setProperty('height', '50px', 'important');
    filepath.style.setProperty('font-size', '14px', 'important');

    // Back button (for mobile/tablet)
    const backBtn = document.createElement('button');
    filepath.appendChild(backBtn);
    backBtn.setAttribute('onclick', ``);
    backBtn.setAttribute('class', 'gdui-mobile gdui-tablet');
    backBtn.style.setProperty('background', 'none', 'important');
    backBtn.style.setProperty('border', 'none', 'important');
    backBtn.style.color = iconColor;
    backBtn.addEventListener('click', folderBack); // We'll define folderBack later

    const backIcon = document.createElement('i');
    backBtn.appendChild(backIcon);
    backIcon.setAttribute('class', 'fa-sharp fa-solid fa-arrow-left fa-2xl');

    // "Home" link (desktop)
    const homePath = document.createElement('p');
    filepath.appendChild(homePath);
    homePath.setAttribute('class', 'folder gdui-desktop');
    homePath.innerText = 'Home ';
    homePath.style.setProperty('whiteSpace', 'pre', 'important');
    homePath.style.setProperty('font-size', '14px', 'important');
    homePath.style.cursor = 'pointer';
    homePath.style.fontWeight = '700';
    homePath.style.color = tertiary;
    // Onclick -> load top folder
    homePath.addEventListener('click', () => folderChange(container.dataset.folder, 1, homePath.id, 'Home'));

    // "Home" link (mobile)
    const mobileHome = document.createElement('p');
    filepath.appendChild(mobileHome);
    mobileHome.setAttribute('class', 'mobile-folder');
    mobileHome.innerText = 'Home';
    mobileHome.style.setProperty('font-size', '14px', 'important');
    mobileHome.style.display = 'none';
    mobileHome.style.color = tertiary;
    mobileHome.style.fontWeight = '700';

    // Right side (search & icons)
    const fileSearch = document.createElement('div');
    uiHeader.appendChild(fileSearch);
    fileSearch.setAttribute('id', 'file-search');
    fileSearch.style.setProperty('display', 'flex', 'important');
    fileSearch.style.setProperty('flex-direction', 'row', 'important');
    fileSearch.style.justifyContent = 'flex-end';
    fileSearch.style.setProperty('align-items', 'center', 'important');
    fileSearch.style.setProperty('margin-right', '0px', 'important');
    fileSearch.style.width = '60%';
    fileSearch.style.setProperty('height', '50px', 'important');

    // Search area
    const searchDiv = document.createElement('div');
    fileSearch.appendChild(searchDiv);

    const input = document.createElement('div');
    searchDiv.appendChild(input);
    input.setAttribute('id', 'input');
    input.style.backgroundColor = secondary;
    input.style.setProperty('display', 'flex', 'important');
    input.style.setProperty('padding', '4px', 'important');

    const magButton = document.createElement('button');
    input.appendChild(magButton);
    magButton.style.setProperty('background', 'none', 'important');
    magButton.style.setProperty('border', 'none', 'important');
    magButton.style.color = iconColor;
    magButton.style.setProperty('height', '2.5em', 'important');
    magButton.style.setProperty('font', 'revert', 'important');
    magButton.addEventListener('click', searchActivate);

    const magGlassIcon = document.createElement('i');
    magButton.appendChild(magGlassIcon);
    magGlassIcon.setAttribute('class', 'fa-sharp fa-solid fa-magnifying-glass fa-lg');

    const inputBox = document.createElement('input');
    input.appendChild(inputBox);
    inputBox.setAttribute('class', 'gdui-desktop gdui-tablet');
    inputBox.setAttribute('type', 'text');
    inputBox.setAttribute('placeholder', 'Search Filenames');
    inputBox.style.setProperty('border', 'none', 'important');
    inputBox.style.setProperty('outline', 'none', 'important');
    inputBox.style.setProperty('background', 'transparent', 'important');
    inputBox.style.setProperty('font', 'revert', 'important');
    inputBox.style.color = iconColor;
    inputBox.addEventListener('keyup', (e) => {
      searchFiles(e.target.value);
    });

    // Icons Div
    const iconsDiv = document.createElement('div');
    fileSearch.appendChild(iconsDiv);
    iconsDiv.style.setProperty('display', 'flex', 'important');
    iconsDiv.style.setProperty('justify-content', 'flex-end', 'important');
    iconsDiv.style.setProperty('align-items', 'center', 'important');

    // Reorder icon
    const fileOrder = document.createElement('button');
    iconsDiv.appendChild(fileOrder);
    fileOrder.setAttribute('class', 'gdui-desktop');
    fileOrder.style.setProperty('margin-right', '3px', 'important');
    fileOrder.style.setProperty('margin-left', '5px', 'important');
    fileOrder.style.setProperty('border', 'none', 'important');
    fileOrder.style.setProperty('background', 'none', 'important');
    fileOrder.style.setProperty('font', 'revert', 'important');
    fileOrder.style.color = iconColor;
    fileOrder.style.cursor = 'pointer';
    fileOrder.addEventListener('click', () => reorderFiles(1));

    const fileOrderIcon = document.createElement('i');
    fileOrder.appendChild(fileOrderIcon);
    fileOrderIcon.setAttribute('class', 'fa-sharp fa-solid fa-arrow-down-wide-short fa-lg');

    // Appearance icon (switch from tiles to list)
    const appearance = document.createElement('button');
    iconsDiv.appendChild(appearance);
    appearance.setAttribute('class', 'gdui-desktop');
    appearance.style.setProperty('margin-right', '3px', 'important');
    appearance.style.setProperty('border', 'none', 'important');
    appearance.style.setProperty('background', '3px', 'important');
    appearance.style.setProperty('font', 'revert', 'important');
    appearance.style.color = iconColor;
    appearance.style.cursor = 'pointer';
    appearance.addEventListener('click', () => explorerView(1));

    const appearanceIcon = document.createElement('i');
    appearance.appendChild(appearanceIcon);
    appearanceIcon.setAttribute('class', 'fa-solid fa-list fa-lg');

    // Refresh button
    const refresh = document.createElement('button');
    iconsDiv.appendChild(refresh);
    refresh.setAttribute('id', 'refresh');
    refresh.style.setProperty('margin-right', '3px', 'important');
    refresh.style.setProperty('border', 'none', 'important');
    refresh.style.setProperty('background', 'none', 'important');
    refresh.style.color = iconColor;
    refresh.style.cursor = 'pointer';
    refresh.style.setProperty('height', '2.5em', 'important');
    refresh.style.setProperty('font', 'revert', 'important');
    refresh.style.transform = 'rotate(0deg)';
    refresh.addEventListener('click', refreshFiles);

    const refreshIcon = document.createElement('i');
    refresh.appendChild(refreshIcon);
    refreshIcon.setAttribute('class', 'fa-sharp fa-solid fa-rotate fa-lg');

    // Select All container
    const selectDiv = document.createElement('button');
    iconsDiv.appendChild(selectDiv);
    selectDiv.setAttribute('class', 'gdui-desktop');
    selectDiv.style.display = 'flex';
    selectDiv.style.cursor = 'pointer';
    selectDiv.style.setProperty('align-items', 'center', 'important');
    selectDiv.style.setProperty('background-color', secondary, 'important');
    selectDiv.style.setProperty('padding-right', '8px', 'important');
    selectDiv.style.setProperty('padding-left', '8px', 'important');
    selectDiv.style.setProperty('height', '35px', 'important');
    selectDiv.style.setProperty('border', 'none', 'important');
    selectDiv.style.setProperty('font', 'revert', 'important');
    selectDiv.addEventListener('click', () => selectFiles('select-all-input', 1));

    const checkmark = document.createElement('i');
    selectDiv.appendChild(checkmark);
    checkmark.setAttribute('id', 'select-all-mark');
    checkmark.setAttribute('class', 'fa-solid fa-check fa-xs');
    checkmark.style.display = 'none';
    checkmark.style.setProperty('position', 'absolute', 'important');
    checkmark.style.setProperty('z-index', '2', 'important');
    checkmark.style.setProperty('color', '#171717', 'important');
    checkmark.style.setProperty('margin-left', '4px', 'important');

    const selectSpan = document.createElement('span');
    selectDiv.appendChild(selectSpan);
    selectSpan.setAttribute('id', 'select-all-span');
    selectSpan.style.setProperty('height', '17px', 'important');
    selectSpan.style.setProperty('width', '17px', 'important');
    selectSpan.style.backgroundColor = '#d3d3d380';
    selectSpan.style.border = '1px solid #292929';
    selectSpan.style.setProperty('display', 'block', 'important');
    selectSpan.style.setProperty('z-index', '1', 'important');

    const selectAll = document.createElement('input');
    selectDiv.appendChild(selectAll);
    selectAll.setAttribute('id', 'select-all-input');
    selectAll.setAttribute('type', 'checkbox');
    selectAll.style.setProperty('appearance', 'none', 'important');
    selectAll.addEventListener('change', (e) => checkVis(e.target));

    const selectLabel = document.createElement('label');
    selectDiv.appendChild(selectLabel);
    selectLabel.setAttribute('id', 'select-all-label');
    selectLabel.style.color = 'white';
    selectLabel.innerText = 'Select All';
    selectLabel.style.cursor = 'pointer';
    selectLabel.style.setProperty('font-size', '14px', 'important');
    selectLabel.style.setProperty('margin-bottom', '0px', 'important');
    selectLabel.style.setProperty('margin-left', '5px', 'important');

    // Header Separator
    const headerSep = document.createElement('hr');
    container.appendChild(headerSep);
    headerSep.style.setProperty('border-color', secondary, 'important');
    headerSep.style.setProperty('width', '100%', 'important');

    // ========== UI FILE SELECTOR ==========
    const UIFileSelector = document.createElement('div');
    container.appendChild(UIFileSelector);
    UIFileSelector.setAttribute('class', 'ui-file-selector');
    UIFileSelector.style.setProperty('padding-left', '5px', 'important');
    UIFileSelector.style.setProperty('padding-right', '5px', 'important');
    UIFileSelector.style.setProperty('margin-top', '20px', 'important');
    UIFileSelector.style.setProperty('margin-bottom', '20px', 'important');

    // Folders container
    const folders = document.createElement('div');
    UIFileSelector.appendChild(folders);
    folders.style.setProperty('display', 'flex', 'important');
    folders.style.setProperty('flex-direction', 'row', 'important');
    folders.style.setProperty('flex-wrap', 'wrap', 'important');
    folders.style.setProperty('margin-bottom', '20px', 'important');

    // Files container
    const files = document.createElement('div');
    UIFileSelector.appendChild(files);
    files.setAttribute('id', 'file-div');
    files.style.setProperty('display', 'flex', 'important');
    files.style.setProperty('flex-direction', 'row', 'important');
    files.style.setProperty('flex-wrap', 'wrap', 'important');

    // ========== UI FOOTER ==========
    const footerSep = document.createElement('hr');
    container.appendChild(footerSep);
    footerSep.style.setProperty('border-color', '#171717', 'important');
    footerSep.style.setProperty('width', '100%', 'important');

    const UIFooter = document.createElement('div');
    container.appendChild(UIFooter);
    UIFooter.setAttribute('class', 'ui-footer');
    UIFooter.style.setProperty('background-color', 'transparent', 'important');
    UIFooter.style.setProperty('display', 'flex', 'important');
    UIFooter.style.setProperty('padding-top', '10px', 'important');
    UIFooter.style.setProperty('padding-bottom', '10px', 'important');
    UIFooter.style.setProperty('padding-right', '0px', 'important');

    const downloadButton = document.createElement('button');
    UIFooter.appendChild(downloadButton);
    downloadButton.setAttribute('id', 'download-button');
    downloadButton.style.setProperty('display', 'flex', 'important');
    downloadButton.style.setProperty('justify-content', 'center', 'important');
    downloadButton.style.setProperty('align-items', 'center', 'important');
    downloadButton.style.setProperty('border', '1px solid #f2f2f2', 'important');
    downloadButton.style.setProperty('font-weight', '700', 'important');
    downloadButton.style.setProperty('outline', 'none', 'important');
    downloadButton.style.setProperty('height', '40px', 'important');
    downloadButton.style.setProperty('font', 'revert', 'important');
    downloadButton.style.backgroundColor = 'transparent';
    downloadButton.style.color = '#f2f2f2';
    downloadButton.style.cursor = 'pointer';
    downloadButton.addEventListener('mouseenter', () => downHov(1));
    downloadButton.addEventListener('mouseleave', () => downHov(2));
    downloadButton.addEventListener('click', downloadMulti);

    const downloadText = document.createElement('p');
    downloadButton.appendChild(downloadText);
    downloadText.innerHTML = 'DOWNLOAD';
    downloadText.style.setProperty('font-size', '14px', 'important');
    downloadText.style.setProperty('font-weight', '700', 'important');

    const downloadImg = document.createElement('i');
    downloadButton.appendChild(downloadImg);
    downloadImg.setAttribute('class', 'fa-sharp fa-solid fa-download');
    downloadImg.style.setProperty('margin-left', '10px', 'important');

    // -----------------------------
    // 3) Responsive CSS Logic
    // -----------------------------
    function ComputerCSS(desktopDivs, tabletDivs, mobileDivs, folderButtons, fileCard, pathing, footFlex, driveFileName) {
      // hide tablet + mobile
      tabletDivs.forEach((val) => val.style.display = 'none');
      mobileDivs.forEach((val) => val.style.display = 'none');
      // show desktop
      desktopDivs.forEach((val) => val.style.display = 'flex');

      container.style.marginLeft = '10%';
      container.style.marginRight = '10%';

      // Hide mobile path
      pathing.forEach((path) => {
        path.style.display = 'none';
      });

      // Folder + file widths
      folderButtons.forEach((folder) => {
        folder.style.width = '215px';
      });
      fileCard.forEach((file) => {
        if (!textIcons) {
          const fileImage = file.getElementsByTagName('img');
          file.style.width = '215px';
          file.style.marginRight = '20px';
          if (fileImage[0]) fileImage[0].style.width = '215px';
        }
      });
      footFlex.forEach((footer) => {
        if (!textIcons) footer.style.height = '20%';
        else footer.style.height = '100%';
      });
      driveFileName.forEach((fileName) => {
        fileName.style.whiteSpace = 'nowrap';
        fileName.style.overflow = 'hidden';
        fileName.style.textOverflow = 'ellipsis';
        fileName.style.height = '';
        fileName.style.display = '';
        fileName.style.alignItems = '';
        fileName.style.wordBreak = '';
        // remove 'n-' from ID to get original name
        fileName.innerText = fileName.id.substring(2);
      });

      input.style.height = '25px';
      magButton.style.paddingBottom = '15px';
      refreshIcon.setAttribute('class', 'fa-sharp fa-solid fa-rotate fa-lg');

      // Footer
      UIFooter.style.justifyContent = 'flex-end';
      UIFooter.style.paddingRight = '0px';
      downloadButton.style.width = '200px';
    }

    function TabletCSS(desktopDivs, tabletDivs, mobileDivs, folderButtons, fileCard, pathing, footFlex, driveFileName) {
      desktopDivs.forEach((val) => val.style.display = 'none');
      mobileDivs.forEach((val) => val.style.display = 'none');
      tabletDivs.forEach((val) => val.style.display = 'flex');

      container.style.marginLeft = '5%';
      container.style.marginRight = '5%';

      // show last mobile folder
      if (pathing.length > 0) {
        pathing[pathing.length - 1].style.display = 'block';
      }

      folderButtons.forEach((folder) => {
        folder.style.width = '215px';
      });
      fileCard.forEach((file) => {
        if (!textIcons) {
          const fileImage = file.getElementsByTagName('img');
          file.style.width = '215px';
          file.style.marginRight = '20px';
          if (fileImage[0]) fileImage[0].style.width = '215px';
        }
      });
      footFlex.forEach((footer) => {
        if (!textIcons) footer.style.height = '20%';
        else footer.style.height = '100%';
      });
      driveFileName.forEach((fileName) => {
        fileName.style.whiteSpace = 'nowrap';
        fileName.style.overflow = 'hidden';
        fileName.style.textOverflow = 'ellipsis';
        fileName.style.height = '';
        fileName.style.display = '';
        fileName.style.alignItems = '';
        fileName.style.wordBreak = '';
        fileName.innerText = fileName.id.substring(2);
      });

      input.style.height = '35px';
      magButton.style.paddingBottom = '7px';
      refreshIcon.setAttribute('class', 'fa-sharp fa-solid fa-rotate fa-2xl');

      UIFooter.style.justifyContent = 'flex-end';
      UIFooter.style.paddingRight = '35px';
      downloadButton.style.width = '200px';
    }

    function PhoneCSS(desktopDivs, tabletDivs, mobileDivs, folderButtons, fileCard, pathing, footFlex, driveFileName) {
      desktopDivs.forEach((val) => val.style.display = 'none');
      tabletDivs.forEach((val) => val.style.display = 'none');
      mobileDivs.forEach((val) => val.style.display = 'flex');

      container.style.marginLeft = '1%';
      container.style.marginRight = '1%';

      // show last mobile folder
      if (pathing.length > 0) {
        pathing[pathing.length - 1].style.display = 'block';
      }

      folderButtons.forEach((folder) => {
        folder.style.width = '46%';
      });
      fileCard.forEach((file) => {
        if (!textIcons) {
          const fileImage = file.getElementsByTagName('img');
          file.style.width = '46%';
          file.style.marginRight = '15px';
          if (fileImage[0]) {
            fileImage[0].style.width = `${(files.offsetWidth * 0.46)}px`;
          }
        }
      });
      footFlex.forEach((footer) => {
        if (!textIcons) footer.style.height = '35%';
        else footer.style.height = '100%';
      });
      driveFileName.forEach((fileName) => {
        fileName.style.height = '50%';
        fileName.style.whiteSpace = '';
        fileName.style.overflow = '';
        fileName.style.textOverflow = '';
        fileName.style.display = 'flex';
        fileName.style.alignItems = 'center';
        fileName.style.wordBreak = 'break-word';
        if (fileName.id.length > 20) {
          fileName.innerText = fileName.id.substring(2, 20) + '...';
        }
      });

      input.style.height = '35px';
      magButton.style.paddingBottom = '7px';
      refreshIcon.setAttribute('class', 'fa-sharp fa-solid fa-rotate fa-2xl');

      UIFooter.style.justifyContent = 'center';
      UIFooter.style.paddingRight = '0px';
      downloadButton.style.width = '95%';
    }

    function cssChange() {
      const desktopDivs  = Array.from(container.getElementsByClassName('gdui-desktop'));
      const tabletDivs   = Array.from(container.getElementsByClassName('gdui-tablet'));
      const mobileDivs   = Array.from(container.getElementsByClassName('gdui-mobile'));
      const folderButtons= Array.from(folders.getElementsByClassName('goog-folder'));
      const fileCard     = Array.from(files.getElementsByClassName('goog-drive-file'));
      const pathing      = Array.from(filepath.getElementsByClassName('mobile-folder'));
      const footFlex     = Array.from(files.getElementsByClassName('footFlex'));
      const driveFileName= Array.from(files.getElementsByClassName('drive-file-name'));

      if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        TabletCSS(desktopDivs, tabletDivs, mobileDivs, folderButtons, fileCard, pathing, footFlex, driveFileName);
      } else if (window.innerWidth < 768) {
        PhoneCSS(desktopDivs, tabletDivs, mobileDivs, folderButtons, fileCard, pathing, footFlex, driveFileName);
      } else {
        ComputerCSS(desktopDivs, tabletDivs, mobileDivs, folderButtons, fileCard, pathing, footFlex, driveFileName);
      }
    }

    // Listen for window resize
    function resizeChecker() {
      clearTimeout(resizeStop);
      resizeStop = setTimeout(cssChange, 100);
    }
    window.addEventListener('resize', resizeChecker);

    // -----------------------------
    // 4) Drive API Calls + Handlers
    // -----------------------------

    async function GetDriveInfo(desFolder, num) {
      // NOTE: For shared drives, you may want to add:
      //   &supportsAllDrives=true&includeItemsFromAllDrives=true
      // if you are fetching from a Shared Drive.
      const url = `https://www.googleapis.com/drive/v3/files?q='${desFolder}'+in+parents&key=${container.dataset.apikey}&fields=files(id,name,mimeType,thumbnailLink,webViewLink)`;

      try {
        const request = new XMLHttpRequest();
        request.open("GET", url);
        request.onload = function() {
          const jsonResponse = JSON.parse(request.responseText);
          switch (num) {
            case 1:
              setFolders(jsonResponse);
              setFiles(jsonResponse);
              cssChange();
              if (textIcons) explorerView();
              break;
            case 2:
              setFiles(jsonResponse);
              cssChange();
              if (textIcons) explorerView();
              break;
            default:
              console.error('Failed to get data.');
          }
        };
        request.send(null);
      } catch (error) {
        console.error('Failed to get files with error: ', error);
      }
    }

    function setFolders(jsonResponse) {
      const googFolders = [];
      if (!jsonResponse.files) return;

      jsonResponse.files.forEach((val) => {
        if (val.mimeType === 'application/vnd.google-apps.folder') {
          googFolders.push(val);
        }
      });

      // Show "previous folder" if depth > 1
      if (arrayPath.length > 1) {
        const backFold = document.createElement('div');
        folders.appendChild(backFold);
        backFold.setAttribute('onclick', ``);
        backFold.classList.add('goog-folder');
        backFold.style.setProperty('margin-bottom', '20px', 'important');
        // ...
        // (Styles truncated for brevity—use your own folder style)
        backFold.addEventListener('click', folderBack);

        const deskVersion = document.createElement('div');
        backFold.appendChild(deskVersion);
        deskVersion.classList.add('gdui-desktop','gdui-tablet');
        deskVersion.style.display = 'flex';

        // arrow + label
        const backVis = document.createElement('div');
        deskVersion.appendChild(backVis);
        backVis.style.display = 'flex';

        const backArrow = document.createElement('i');
        backVis.appendChild(backArrow);
        backArrow.setAttribute('class', 'fa-solid fa-sharp fa-arrow-left fa-2xl');

        const prevFold = document.createElement('p');
        backVis.appendChild(prevFold);
        prevFold.innerText = 'Previous Folder';
      }

      googFolders.forEach((folder) => {
        const folderViewer = document.createElement('div');
        folders.appendChild(folderViewer);
        folderViewer.classList.add('goog-folder');
        folderViewer.style.cursor = 'pointer';
        // style as you wish

        // Onclick -> change folder
        folderViewer.addEventListener('click', () => {
          folderChange(folder.id, 2, arrayPath.length, folder.name);
        });

        const desktopVer = document.createElement('div');
        folderViewer.appendChild(desktopVer);
        desktopVer.classList.add('deskVer','gdui-desktop','gdui-tablet');
        desktopVer.style.display = 'flex';

        const folderInfo = document.createElement('div');
        desktopVer.appendChild(folderInfo);
        folderInfo.style.display = 'flex';

        const folderIcon = document.createElement('i');
        folderInfo.appendChild(folderIcon);
        folderIcon.setAttribute('class', 'fa-solid fa-sharp fa-folder-closed fa-2xl');

        const foldName = document.createElement('p');
        folderInfo.appendChild(foldName);
        foldName.innerText = folder.name;
      });
    }

    function setFiles(jsonResponse) {
      if (!jsonResponse.files) return;
      const googFiles = [];
      jsonResponse.files.forEach((val) => {
        if (val.mimeType !== 'application/vnd.google-apps.folder') {
          googFiles.push(val);
        }
      });

      const ordGoogFiles = reorderFiles(2, googFiles);
      if (!ordGoogFiles) return;

      ordGoogFiles.forEach((file) => {
        const fileViewer = document.createElement('div');
        files.appendChild(fileViewer);
        fileViewer.classList.add('goog-drive-file');
        fileViewer.setAttribute('id', file.name);

        // (Add all your styling / structure here)
        // e.g. "bodFlex", "footFlex", etc.

        // Example:
        const bodFlex = document.createElement('div');
        fileViewer.appendChild(bodFlex);
        bodFlex.classList.add('bodFlex');
        bodFlex.style.setProperty('height', '80%', 'important');

        // ...
        // previewImage, checkboxes, etc.

      });
    }

    // -----------------------------
    // 5) Other Utility Functions
    // -----------------------------
    function reorderFiles(num, response = 0) {
      switch(num) {
        case 1:
          ascending = !ascending;
          const filesToArrange = Array.from(files.getElementsByClassName('goog-drive-file'));
          if (ascending) {
            fileOrderIcon.setAttribute('class', 'fa-sharp fa-solid fa-arrow-down-wide-short fa-lg');
            filesToArrange.sort((a, b) => a.id.localeCompare(b.id)).forEach(val => files.appendChild(val));
          } else {
            fileOrderIcon.setAttribute('class', 'fa-sharp fa-solid fa-arrow-up-wide-short fa-lg');
            filesToArrange.sort((a, b) => b.id.localeCompare(a.id)).forEach(val => files.appendChild(val));
          }
          return;
        case 2:
          if (!response || !Array.isArray(response)) return;
          if (ascending) {
            response.sort((a,b) => a.name.localeCompare(b.name));
          } else {
            response.sort((a,b) => b.name.localeCompare(a.name));
          }
          return response;
        default:
          console.error('unexpected num val passed');
      }
    }

    function folderChange(id, num, foldID = 0, name = '') {
      inputBox.value = '';

      setFilepath(id, num, foldID, name);

      while (folders.firstChild) folders.removeChild(folders.firstChild);
      while (files.firstChild) files.removeChild(files.firstChild);

      GetDriveInfo(arrayPath[foldID], 1);
    }

    function folderBack() {
      const pathing = Array.from(filepath.getElementsByClassName('folder'));
      if (arrayPath.length > 1) {
        const lastPath = pathing[pathing.length - 2];
        if (lastPath) lastPath.click();
      }
    }

    function setFilepath(id, num, foldID, name) {
      const folderArray = Array.from(filepath.getElementsByClassName('folder'));
      const mobileArray = Array.from(filepath.getElementsByClassName('mobile-folder'));

      switch(num) {
        case 1:
          for (let i = parseInt(foldID); i < folderArray.length -1; i++) {
            arrayPath.pop();
            if (filepath.lastElementChild) {
              filepath.removeChild(filepath.lastElementChild);
            }
            // remove more if needed
          }
          break;
        case 2:
          arrayPath.push(id);
          // add slash + new path
          const slashPath = document.createElement('p');
          slashPath.innerText = '/';
          filepath.appendChild(slashPath);

          const newPath = document.createElement('p');
          newPath.setAttribute('id', folderArray.length);
          newPath.setAttribute('class', 'folder gdui-desktop');
          newPath.innerText = ' ' + name + ' ';
          newPath.style.cursor = 'pointer';
          newPath.addEventListener('click', () => folderChange(id, 1, newPath.id, name));
          filepath.appendChild(newPath);

          const mobilePath = document.createElement('p');
          mobilePath.setAttribute('class', 'mobile-folder');
          mobilePath.innerText = name;
          filepath.appendChild(mobilePath);
          break;
        default:
          console.error('Failed to set filepath');
      }
    }

    function refreshFiles() {
      while (files.firstChild) files.removeChild(files.firstChild);
      inputBox.value = '';
      GetDriveInfo(arrayPath[arrayPath.length - 1], 2);
    }

    function explorerView(num = 0) {
      // toggle textIcons
      if (num === 1) textIcons = !textIcons;
      // ... your view logic
    }

    function searchActivate() {
      // mobile logic
      if (window.innerWidth < 768) {
        if (inputBox.style.display !== 'none') {
          inputBox.style.display = 'none';
          filepath.style.display = 'flex';
          fileSearch.style.width = '60%';
          fileSearch.style.justifyContent = 'flex-end';
        } else {
          inputBox.style.display = 'block';
          filepath.style.display = 'none';
          fileSearch.style.width = '100%';
          fileSearch.style.justifyContent = 'space-between';
        }
      }
    }

    function searchFiles(input) {
      const filesSearch = files.getElementsByClassName('goog-drive-file');
      for (let i = 0; i < filesSearch.length; i++) {
        if (input === '') {
          filesSearch[i].style.display = 'flex';
        } else {
          if (filesSearch[i].id.toLowerCase().includes(input.toLowerCase())) {
            filesSearch[i].style.display = 'flex';
          } else {
            filesSearch[i].style.display = 'none';
          }
        }
      }
    }

    function selectFiles(id, num=0) {
      const inputBoxElem = document.getElementById(id);
      if (!inputBoxElem) return;
      inputBoxElem.click();

      let checkState = inputBoxElem.checked;
      let togChecks = textIcons
        ? files.getElementsByClassName('t-file-selector')
        : files.getElementsByClassName('file-selector');

      for (let box of togChecks) {
        if (checkState && !box.checked) {
          box.click();
        } else if (!checkState && box.checked) {
          box.click();
        }
      }
    }

    function checkVis(check) {
      let str = check.id.slice(0, check.id.length-6);
      const inputMark = document.getElementById(`${str}-mark`);
      const inputSpan = document.getElementById(`${str}-span`);
      if (inputMark && inputSpan) {
        if (check.checked) {
          inputMark.style.display = 'block';
          inputSpan.style.backgroundColor = tertiary;
          inputSpan.style.border = `1px solid ${tertiary}`;
        } else {
          inputMark.style.display = 'none';
          inputSpan.style.backgroundColor = '#d3d3d380';
          inputSpan.style.border = `1px solid #292929`;
        }
      }
      setDownAccess();
    }

    function setDownAccess() {
      let togChecks = textIcons
        ? files.getElementsByClassName('t-file-selector')
        : files.getElementsByClassName('file-selector');

      let anyChecked = false;
      for (let check of togChecks) {
        if (check.checked) {
          anyChecked = true;
          break;
        }
      }
      if (anyChecked) {
        downloadButton.disabled = false;
        downloadButton.style.backgroundColor = tertiary;
        downloadButton.style.cursor = 'pointer';
      } else {
        downloadButton.disabled = true;
        downloadButton.style.backgroundColor = 'transparent';
        downloadButton.style.cursor = '';
      }
    }

    function downHov(num) {
      if (num === 1) {
        downloadButton.style.color = iconColor;
      } else {
        downloadButton.style.color = '#f2f2f2';
      }
    }

    async function downloadMulti() {
      let togChecks = textIcons
        ? files.getElementsByClassName('t-file-selector')
        : files.getElementsByClassName('file-selector');

      for (let i = 0; i < togChecks.length; i++) {
        if (togChecks[i].checked && togChecks[i].style.display !== 'none') {
          const fileId = togChecks[i].value;
          const fileName = togChecks[i].id.slice(0, togChecks[i].id.length - 6);
          const urlForFile = `https://www.googleapis.com/drive/v3/files/${fileId}?alt=media&key=${container.dataset.apikey}`;

          // XHR approach
          xhrRequest(i, urlForFile, fileName);
        }
      }

      async function xhrRequest(index, url, name) {
        try {
          xhr[index] = new XMLHttpRequest();
          xhr[index].responseType = 'blob';
          xhr[index].open("GET", url, true);
          xhr[index].onload = () => {
            const a = document.createElement('a');
            a.href = window.URL.createObjectURL(xhr[index].response);
            a.download = name;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            a.remove();
          };
          xhr[index].send(null);
        } catch (error) {
          console.error('Download request failed with error: ', error);
        }
      }
    }

    async function downloadSingle(id, name) {
      const urlForFile = `https://www.googleapis.com/drive/v3/files/${id}?alt=media&key=${container.dataset.apikey}`;
      try {
        const singleXhr = new XMLHttpRequest();
        singleXhr.open("GET", urlForFile);
        singleXhr.responseType = 'blob';
        singleXhr.onload = () => {
          const a = document.createElement('a');
          a.href = window.URL.createObjectURL(singleXhr.response);
          a.download = name;
          a.style.display = 'none';
          document.body.appendChild(a);
          a.click();
        };
        singleXhr.send(null);
      } catch (error) {
        console.error('Download request failed with error:', error);
      }
    }

    // If you have a dropdown, you can adapt dropDownEnd() or dropClick() similarly.

    // -----------------------------
    // 6) Initial Load
    // -----------------------------
    cssChange();
    GetDriveInfo(arrayPath[0], 1);
  }

  // Finally, automatically initialize a file browser for each .drive-browser
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.drive-browser').forEach((div) => {
      initGoogleDriveBrowser(div);
    });
  });

})();
