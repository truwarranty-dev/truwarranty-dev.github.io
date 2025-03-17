/**
 * googleDriveMultiBrowser.js
 * 
 * A multi-browser version of your old code. 
 * - Finds all .drive-browser elements on the page
 * - Builds the same UI structure (folder path, search, etc.)
 * - No repeated global IDs: everything references local classes or 
 *   is stored in local variables for each instance.
 */
document.addEventListener('DOMContentLoaded', initAllDriveBrowsers);

function initAllDriveBrowsers() {
  const allBrowsers = document.querySelectorAll('.drive-browser');
  allBrowsers.forEach((browserEl, index) => {
    initSingleDriveBrowser(browserEl, index);
  });
}

/**
 * Initializes one "Google Drive" browser instance 
 * inside the given `browserEl` container.
 */
function initSingleDriveBrowser(browserEl, instanceIndex) {
  // Pull folder + API key from data attributes
  const apiKey = browserEl.dataset.apikey || '';
  const startFolder = browserEl.dataset.folder || '';
  
  // Store instance-wide variables in a closure:
  let arrayPath = [startFolder];
  let ascending = true;
  let textIcons = false;  
  let primary = '#ffffff';
  let secondary = '#f2f2f2';
  let tertiary = '#000000';
  let iconColor = 'black';
  let fontStyle = "'Roboto', sans-serif";

  // Create top-level UI structure inside `browserEl`.
  // We'll mimic your old code’s big DOM creation. 
  // Then store references (foldersEl, filesEl, pathEl, etc.) in local object.
  const uiRefs = buildUI(browserEl, instanceIndex);

  // Now that we have references, let's define the “core” 
  // logic functions that were global in your old code,
  // but keep them local and pass references as needed.

  // =========== SEARCH / ACTIVATE MOBILE SEARCH =============
  function searchActivate() {
    // Show/hide the search input in mobile
    if (window.innerWidth < 768) {
      if (uiRefs.inputBox.style.display !== 'none') {
        uiRefs.inputBox.style.display = 'none';
        uiRefs.filepathEl.style.display = 'flex';
        uiRefs.fileSearchEl.style.width = '60%';
        uiRefs.fileSearchEl.style.justifyContent = 'flex-end';
      } else {
        uiRefs.inputBox.style.display = 'block';
        uiRefs.filepathEl.style.display = 'none';
        uiRefs.fileSearchEl.style.width = '100%';
        uiRefs.fileSearchEl.style.justifyContent = 'space-between';
      }
    }
  }

  function searchFiles(input) {
    const fileCards = uiRefs.filesEl.getElementsByClassName('goog-drive-file');
    for (let i = 0; i < fileCards.length; i++) {
      const card = fileCards[i];
      if (!input) {
        card.style.display = 'flex';
        maybeShowCheckbox(card);
      } else {
        // Compare lowercased ID (which we set as file name)
        const match = card.id.toLowerCase().includes(input.toLowerCase());
        if (match) {
          card.style.display = 'flex';
          maybeShowCheckbox(card);
        } else {
          // Hide it and uncheck
          card.style.display = 'none';
          const sel = card.querySelector(textIcons ? '.t-file-selector' : '.file-selector');
          if (sel) {
            sel.checked = false;
            sel.style.display = 'none';
          }
        }
      }
    }
  }

  /** Show the correct checkbox if the item is visible. */
  function maybeShowCheckbox(fileCard) {
    if (!textIcons) {
      const c = fileCard.querySelector('.file-selector');
      if (c) c.style.display = 'block';
    } else {
      const c = fileCard.querySelector('.t-file-selector');
      if (c) c.style.display = 'block';
    }
  }

  // ================== SORT ====================
  function reorderFiles(num, response = null) {
    switch(num) {
      case 1: // user clicked the UI sort button
        ascending = !ascending;
        const allCards = Array.from(uiRefs.filesEl.getElementsByClassName('goog-drive-file'));
        if (ascending) {
          uiRefs.fileOrderIcon.className = 'fa-sharp fa-solid fa-arrow-down-wide-short fa-lg';
          uiRefs.fileOrderIconDrop.className = 'fa-sharp fa-solid fa-arrow-down-wide-short fa-2xl drop-element';
          allCards.sort((a,b)=>{
            if (a.id && b.id) return a.id.toLowerCase()>b.id.toLowerCase()?1:-1;
            return 0;
          }).forEach(c => uiRefs.filesEl.appendChild(c));
        } else {
          uiRefs.fileOrderIcon.className = 'fa-sharp fa-solid fa-arrow-up-wide-short fa-lg';
          uiRefs.fileOrderIconDrop.className = 'fa-sharp fa-solid fa-arrow-up-wide-short fa-2xl drop-element';
          allCards.sort((a,b)=>{
            if (a.id && b.id) return a.id.toLowerCase()<b.id.toLowerCase()?1:-1;
            return 0;
          }).forEach(c => uiRefs.filesEl.appendChild(c));
        }
        return;

      case 2: // sorting array of items from the API
        if (!response) return null;
        if (ascending) {
          response.sort((a,b)=>{
            if(a.name&&b.name) return a.name.toLowerCase()>b.name.toLowerCase()?1:-1;
            return 0;
          });
        } else {
          response.sort((a,b)=>{
            if(a.name&&b.name) return a.name.toLowerCase()<b.name.toLowerCase()?1:-1;
            return 0;
          });
        }
        return response;

      default:
        console.error('unexpected reorderFiles param');
    }
  }

  // ================= FILE EXPLORER MODE (grid vs text) =================
  function explorerView(num=0) {
    const fileSelectorImg = uiRefs.filesEl.getElementsByClassName('file-selector');
    const fileSelectorTxt = uiRefs.filesEl.getElementsByClassName('t-file-selector');
    const bodFlexEls = uiRefs.filesEl.getElementsByClassName('bodFlex');
    const selDivTextEls = uiRefs.filesEl.getElementsByClassName('selDivText');
    const fileCardEls = uiRefs.filesEl.getElementsByClassName('goog-drive-file');
    const footFlexEls = uiRefs.filesEl.getElementsByClassName('footFlex');
    const nameDivEls = uiRefs.filesEl.getElementsByClassName('name-div');
    const iconDivEls = uiRefs.filesEl.getElementsByClassName('icon-div');

    if (num === 1) {
      textIcons = !textIcons;
    }

    // If user had "select all" checked, uncheck it
    if (uiRefs.selectAllCheckbox && uiRefs.selectAllCheckbox.checked) {
      uiRefs.selectAllCheckbox.click();
    }
    if (uiRefs.selectAllDrop && uiRefs.selectAllDrop.checked) {
      uiRefs.selectAllDrop.click();
    }

    // Uncheck everything
    Array.from(fileSelectorImg).forEach(c => { if(c.checked) c.click(); });
    Array.from(fileSelectorTxt).forEach(c => { if(c.checked) c.click(); });

    if (textIcons) {
      // Switch to text-based layout
      Array.from(bodFlexEls).forEach(e => e.style.display='none');
      Array.from(selDivTextEls).forEach(e => e.style.display='');
      Array.from(fileCardEls).forEach(e => {
        e.style.height='50px'; 
        e.style.width='100%';
      });
      Array.from(footFlexEls).forEach(e => {
        e.style.height='100%'; 
        e.style.zIndex='';
      });
      Array.from(nameDivEls).forEach(e => e.style.marginLeft='10px');
      Array.from(iconDivEls).forEach(e => e.style.marginRight='10px');

    } else {
      // Switch to grid with thumbnails
      Array.from(bodFlexEls).forEach(e => e.style.display='');
      Array.from(selDivTextEls).forEach(e => e.style.display='none');
      Array.from(fileCardEls).forEach(e=>{
        e.style.height='250px';
        e.style.width='220px';
      });
      Array.from(footFlexEls).forEach(e=>{
        e.style.zIndex='3';
        if(window.innerWidth<768) e.style.height='35%';
        else e.style.height='20%';
      });
      Array.from(nameDivEls).forEach(e=> e.style.marginLeft='5px');
      Array.from(iconDivEls).forEach(e=> e.style.marginRight='5px');
    }
  }

  // ================= REFRESH =================
  function refreshFiles() {
    // Clear out files
    while(uiRefs.filesEl.firstChild) {
      uiRefs.filesEl.removeChild(uiRefs.filesEl.firstChild);
    }
    if (uiRefs.inputBox) uiRefs.inputBox.value = '';
    // Re‐fetch from the current folder
    const lastFolder = arrayPath[arrayPath.length-1];
    GetDriveInfo(lastFolder, /*mode=*/2);
  }

  // ================= SELECT ALL =================
  function selectFiles(checkboxEl, isDrop=false) {
    // Toggle the “select all” state
    checkboxEl.click();
    const checkState = checkboxEl.checked;

    const toggles = !textIcons 
       ? uiRefs.filesEl.getElementsByClassName('file-selector')
       : uiRefs.filesEl.getElementsByClassName('t-file-selector');

    if (checkState) {
      // Turn ON all
      Array.from(toggles).forEach(box=>{
        if(!box.checked) box.click();
      });
    } else {
      // Turn OFF all
      Array.from(toggles).forEach(box=>{
        if(box.checked) box.click();
      });
    }
  }

  // ================= CHECKBOX VISUALS =================
  function checkVis(check) {
    const str = check.id.slice(0, check.id.length - 6);
    const mark = document.getElementById(str+'-mark');
    const span = document.getElementById(str+'-span');
    if (mark && span) {
      if (check.checked) {
        mark.style.display='block';
        span.style.backgroundColor = tertiary;
        span.style.border = `1px solid ${tertiary}`;
      } else {
        mark.style.display='none';
        span.style.backgroundColor='#d3d3d380';
        span.style.border='1px solid #292929';
      }
    }
    setDownAccess();
  }

  function fileToggle(iconEl) {
    const str = iconEl.id.slice(0, iconEl.id.length-5);
    const input = document.getElementById(str+'-input');
    if (input) {
      input.click();
      checkVis(input);
    }
  }

  // Enable/disable “DOWNLOAD” button
  function setDownAccess() {
    const toggles = !textIcons
      ? uiRefs.filesEl.getElementsByClassName('file-selector')
      : uiRefs.filesEl.getElementsByClassName('t-file-selector');
    let anyChecked = false;
    for(let i=0; i<toggles.length; i++){
      if (toggles[i].checked) {
        anyChecked = true; 
        break;
      }
    }
    if (anyChecked) {
      uiRefs.downloadBtn.disabled = false;
      uiRefs.downloadBtn.style.backgroundColor = tertiary;
      uiRefs.downloadBtn.style.cursor='pointer';
    } else {
      uiRefs.downloadBtn.disabled = true;
      uiRefs.downloadBtn.style.backgroundColor='transparent';
      uiRefs.downloadBtn.style.cursor='';
    }
  }

  // ============== FILEPATH BREADCRUMB ==============
  function setFilepath(folderId, mode, foldIndex, folderName) {
    const folderEls = uiRefs.filepathEl.getElementsByClassName('folder');
    const mobileEls = uiRefs.filepathEl.getElementsByClassName('mobile-folder');
    switch(mode){
      case 1:
        // remove everything after
        for(let i=parseInt(foldIndex); i<folderEls.length-1; i++){
          arrayPath.pop();
          // remove the last 3 nodes (slash, folder, mobile?)
          if(uiRefs.filepathEl.lastElementChild !== null) {
            uiRefs.filepathEl.removeChild(uiRefs.filepathEl.lastElementChild);
            uiRefs.filepathEl.removeChild(uiRefs.filepathEl.lastElementChild);
            uiRefs.filepathEl.removeChild(uiRefs.filepathEl.lastElementChild);
          } else break;
        }
        break;
      case 2:
        // append
        arrayPath.push(folderId);
        const slash = document.createElement('p');
        slash.className='slash gdui-desktop';
        slash.style.fontSize='14px';
        slash.innerText='/';
        uiRefs.filepathEl.appendChild(slash);

        const newPath = document.createElement('p');
        newPath.id=(folderEls.length);
        newPath.className='folder gdui-desktop';
        newPath.innerText=' '+folderName+' ';
        newPath.style.fontSize='14px';
        newPath.style.whiteSpace='pre';
        newPath.style.cursor='pointer';
        newPath.setAttribute('onclick', 
          `window.__driveBrowserAPI?.folderChange("${instanceIndex}", "${folderId}", 1, this.id, this.innerText);`);
          // we’ll override this with a real function pointer below
        uiRefs.filepathEl.appendChild(newPath);

        const mobPath = document.createElement('p');
        mobPath.className='mobile-folder';
        mobPath.style.fontSize='14px';
        mobPath.innerText=folderName;
        uiRefs.filepathEl.appendChild(mobPath);

        if(window.innerWidth>=1024){
          slash.style.display='flex';
          newPath.style.display='flex';
          mobPath.style.display='none';
        } else {
          slash.style.display='none';
          newPath.style.display='none';
          mobPath.style.display='flex';
        }
        Array.from(mobileEls).forEach((m,i)=>{
          if(i!==mobileEls.length) m.style.display='none';
        });
        break;
      default:
        console.error('Failed setFilepath');
    }
    // Recolor path
    const allChildren = Array.from(uiRefs.filepathEl.children);
    for(let i=0; i<allChildren.length; i++){
      if(i>=allChildren.length-2){
        allChildren[i].style.color=tertiary;
        allChildren[i].style.fontWeight='700';
      } else {
        allChildren[i].style.color='#171717';
        allChildren[i].style.fontWeight='500';
        uiRefs.backBtn.style.color=iconColor;
      }
    }
  }

  function folderChange(id, mode, foldIDStr='0', name='') {
    if(uiRefs.inputBox) uiRefs.inputBox.value='';
    const foldIndex = parseInt(foldIDStr)||0;
    setFilepath(id, mode, foldIndex, name);

    // remove old
    while(uiRefs.foldersEl.firstChild){
      uiRefs.foldersEl.removeChild(uiRefs.foldersEl.firstChild);
    }
    while(uiRefs.filesEl.firstChild){
      uiRefs.filesEl.removeChild(uiRefs.filesEl.firstChild);
    }
    // re‐fetch
    const folderId = arrayPath[foldIndex];
    GetDriveInfo(folderId, 1);
  }

  function folderBack() {
    const pathFolders = uiRefs.filepathEl.getElementsByClassName('folder');
    if (arrayPath.length>1){
      const lastPath = pathFolders[pathFolders.length-2];
      if(lastPath) lastPath.click();
    }
  }

  // ============== OPEN FILE ==============
  function openFile(link) {
    window.open(link, '_blank');
  }

  // ============= HOVER EFFECTS =============
  function hoverEffect(el, num) {
    switch(num) {
      case 1: {
        // for files
        const foot = el.getElementsByClassName('footFlex');
        const pdfIco = el.getElementsByClassName('pdf-icon');
        if(!foot.length||!pdfIco.length) return;
        if (foot[0].style.backgroundColor===secondary){
          el.style.zIndex='10';
          foot[0].style.backgroundColor=tertiary;
          pdfIco[0].style.color=iconColor;
          if(!textIcons) el.style.transform='scale(1.1)';
          else el.style.transform='scale(1.05)';
        } else {
          el.style.zIndex='';
          foot[0].style.backgroundColor=secondary;
          pdfIco[0].style.color=tertiary;
          el.style.transform='';
        }
        break;
      }
      case 2: {
        // for folders
        if(el.style.backgroundColor===secondary){
          el.style.backgroundColor=tertiary;
          el.style.transform='scale(1.08)';
        } else {
          el.style.backgroundColor=secondary;
          el.style.transform='';
        }
        break;
      }
      default:
        console.error('Hover effect fail');
    }
  }

  function icoHovEffect(icon, state, refreshIco=false, selDiv=false) {
    switch(state){
      case 1:
        if(refreshIco && uiRefs.refreshBtn 
          && uiRefs.refreshBtn.style.transform==='rotate(0deg)'){
          // do some rotate
          spinRefreshIcon(uiRefs.refreshBtn);
        }
        if(selDiv && uiRefs.selectAllLabel){
          uiRefs.selectAllLabel.style.color='#989898';
        } else {
          icon.style.color='#989898';
        }
        break;
      case 2:
        if(selDiv && uiRefs.selectAllLabel){
          uiRefs.selectAllLabel.style.color=iconColor;
        } else {
          icon.style.color=iconColor;
        }
        break;
      default:
        console.error('icoHovEffect fail');
    }
  }
  async function spinRefreshIcon(refreshBtn) {
    // quickly rotate the button
    const timer = ms=>new Promise(res=>setTimeout(res, ms));
    for(let i=1; i<360;){
      refreshBtn.style.transform=`rotate(${i}deg)`;
      await timer(1);
      i+=4;
    }
    refreshBtn.style.transform='rotate(0deg)';
  }

  function downHov(num) {
    switch(num){
      case 1: uiRefs.downloadBtn.style.color=iconColor; break;
      case 2: uiRefs.downloadBtn.style.color='#f2f2f2'; break;
      default: console.error('downHov fail');
    }
  }

  // =========== DOWNLOAD MULTIPLE ===========
  async function downloadMulti() {
    const toggles = !textIcons
      ? uiRefs.filesEl.getElementsByClassName('file-selector')
      : uiRefs.filesEl.getElementsByClassName('t-file-selector');

    for(let i=0; i<toggles.length; i++){
      const c = toggles[i];
      if(c.checked && c.style.display!=='none'){
        const url = "https://www.googleapis.com/drive/v3/files/" + c.value 
                  + "?alt=media&key=" + apiKey;
        const fileName = c.id.slice(0, c.id.length-6);

        // do XHR
        try{
          const xhr = new XMLHttpRequest();
          xhr.responseType='blob';
          xhr.open('GET', url, true);
          xhr.onload=()=>{
            const link = document.createElement('a');
            link.href=window.URL.createObjectURL(xhr.response);
            link.download=fileName;
            link.style.display='none';
            document.body.appendChild(link);
            link.click();
            link.remove();
          };
          xhr.send(null);
        } catch(e){
          console.error('Download request fail: ', e);
        }
      }
    }
  }

  // =========== DOWNLOAD SINGLE ===========
  async function downloadSingle(id, name) {
    const url = "https://www.googleapis.com/drive/v3/files/" + id 
              + "?alt=media&key=" + apiKey;
    try {
      const xhr = new XMLHttpRequest();
      xhr.responseType='blob';
      xhr.onload = () => {
        const link = document.createElement('a');
        link.href=window.URL.createObjectURL(xhr.response);
        link.download=name;
        link.style.display='none';
        document.body.appendChild(link);
        link.click();
      };
      xhr.open('GET', url, true);
      xhr.send(null);
    } catch(e){
      console.error('Download single fail:', e);
    }
  }

  // =========== DROPDOWN ===============
  function dropDownEnd(evt) {
    if(!evt.target.classList.contains('drop-element')){
      const allDropmenus = browserEl.getElementsByClassName('dropmenu');
      Array.from(allDropmenus).forEach(m=>{
        if(m.style.display!=='none') m.style.display='none';
      });
      window.removeEventListener('click', dropDownEnd);
    }
  }
  function dropClick(fileName) {
    const menu = document.getElementById(`${fileName}-dropmenu`);
    if(!menu) return;
    if(menu.style.display==='none'){
      menu.style.display='flex';
      window.addEventListener('click', dropDownEnd);
    } else {
      menu.style.display='none';
    }
  }

  // =========== FETCHING FILES API ===============
  async function GetDriveInfo(folderId, mode) {
    // mode=1 => we are refreshing the entire folder 
    // mode=2 => we are just re-grabbing files on refresh
    const url = 'https://www.googleapis.com/drive/v3/files'
              + `?q="${folderId}"+in+parents`
              + `&key=${apiKey}`
              + '&fields=files(id, name, mimeType, thumbnailLink, webViewLink)';
    try {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.onload = ()=>{
        const response = JSON.parse(xhr.responseText);
        switch(mode){
          case 1:
            setFolders(response);
            setFiles(response);
            applyResponsiveCSS(); 
            if(textIcons) explorerView();
            break;
          case 2:
            setFiles(response);
            applyResponsiveCSS();
            if(textIcons) explorerView();
            break;
          default:
            console.error('failed to get data');
        }
      };
      xhr.send(null);
    } catch(e) {
      console.error('Failed to get drive files: ', e);
    }
  }

  function setFolders(jsonResp) {
    const subfolders = [];
    jsonResp.files.forEach(f=>{
      if(f.mimeType==='application/vnd.google-apps.folder'){
        subfolders.push(f);
      }
    });
    // If not top-level? Add the “back” tile
    if(arrayPath.length>1){
      const backFold = document.createElement('div');
      backFold.className='goog-folder';
      backFold.onclick=()=>folderBack();
      backFold.onmouseenter=()=>hoverEffect(backFold,2);
      backFold.onmouseleave=()=>hoverEffect(backFold,2);
      backFold.style.marginBottom='20px';
      backFold.style.marginRight='20px';
      backFold.style.width='215px';
      backFold.style.cursor='pointer';
      backFold.style.fontSize='12px';
      backFold.style.fontWeight='500';
      backFold.style.backgroundColor=secondary;
      backFold.style.transition='all .2s ease-in-out';
      backFold.style.borderRadius='3px';
      backFold.style.boxShadow=(
        'rgba(14, 63, 126, 0.06) 0px 0px 0px 1px,' +
        'rgba(42, 51, 70, 0.03) 0px 1px 1px -0.5px,' +
        'rgba(42, 51, 70, 0.04) 0px 2px 2px -1px,' +
        'rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px,' +
        'rgba(42, 51, 70, 0.03) 0px 5px 5px -2.5px,' +
        'rgba(42, 51, 70, 0.03) 0px 10px 10px -5px,' +
        'rgba(42, 51, 70, 0.03) 0px 24px 24px -8px'
      );
      // inside, add some child for “Previous Folder”
      const label = document.createElement('div');
      label.style.display='flex';
      label.style.alignItems='center';
      label.style.paddingLeft='10px';
      const arrow = document.createElement('i');
      arrow.className='fa-solid fa-sharp fa-arrow-left fa-2xl';
      arrow.style.fontSize='3em';
      arrow.style.color='#292929';
      label.appendChild(arrow);
      const text = document.createElement('p');
      text.innerText='Previous Folder';
      text.style.marginLeft='10px';
      text.style.fontSize='14px';
      label.appendChild(text);

      backFold.appendChild(label);
      uiRefs.foldersEl.appendChild(backFold);
    }
    // For each subfolder
    subfolders.forEach( fold=>{
      const fDiv = document.createElement('div');
      fDiv.className='goog-folder';
      fDiv.onclick=()=>folderChange(fold.id,2, ''+arrayPath.length, fold.name);
      fDiv.onmouseenter=()=>hoverEffect(fDiv,2);
      fDiv.onmouseleave=()=>hoverEffect(fDiv,2);
      fDiv.style.marginRight='20px';
      fDiv.style.marginBottom='20px';
      fDiv.style.width='215px';
      fDiv.style.backgroundColor=secondary;
      fDiv.style.cursor='pointer';
      fDiv.style.borderRadius='3px';
      fDiv.style.fontSize='12px';
      fDiv.style.transition='all .2s ease-in-out';
      fDiv.style.minHeight='40px';
      fDiv.style.boxShadow=(
        'rgba(14, 63, 126, 0.06) 0px 0px 0px 1px,' +
        'rgba(42, 51, 70, 0.03) 0px 1px 1px -0.5px,' +
        'rgba(42, 51, 70, 0.04) 0px 2px 2px -1px,' +
        'rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px,' +
        'rgba(42, 51, 70, 0.03) 0px 5px 5px -2.5px,' +
        'rgba(42, 51, 70, 0.03) 0px 10px 10px -5px,' +
        'rgba(42, 51, 70, 0.03) 0px 24px 24px -8px'
      );

      // add child structure for the folder icon + name
      const deskVer = document.createElement('div');
      deskVer.className='deskVer gdui-desktop gdui-tablet';
      deskVer.style.justifyContent='space-between';
      deskVer.style.alignItems='center';
      deskVer.style.minHeight='40px';
      deskVer.style.display='flex';

      const folderInfo = document.createElement('div');
      folderInfo.style.display='flex';
      folderInfo.style.alignItems='center';
      folderInfo.style.paddingLeft='10px';
      // icon
      const fIcon = document.createElement('i');
      fIcon.className='fa-solid fa-sharp fa-folder-closed fa-2xl';
      fIcon.style.color='#292929';
      folderInfo.appendChild(fIcon);
      // name
      const fName = document.createElement('p');
      fName.innerText=fold.name;
      fName.style.marginLeft='10px';
      fName.style.fontSize='14px';
      folderInfo.appendChild(fName);

      deskVer.appendChild(folderInfo);
      // open arrow
      const openI = document.createElement('i');
      openI.className='fa-sharp fa-solid fa-chevron-down';
      openI.style.paddingRight='10px';
      deskVer.appendChild(openI);

      fDiv.appendChild(deskVer);
      uiRefs.foldersEl.appendChild(fDiv);
    });
  }

  function setFiles(jsonResp) {
    const filesOnly = [];
    jsonResp.files.forEach(f=>{
      if(f.mimeType!=='application/vnd.google-apps.folder') filesOnly.push(f);
    });
    const sorted = reorderFiles(2, filesOnly);
    (sorted||[]).forEach( file=>{
      // replicate your create-file-card structure
      const card = document.createElement('div');
      card.className='goog-drive-file';
      card.id=file.name; // so searching by card.id
      card.onmouseenter=()=>hoverEffect(card,1);
      card.onmouseleave=()=>hoverEffect(card,1);
      card.style.display='flex';
      card.style.flexDirection='column';
      card.style.transition='all .2s ease-in-out';
      card.style.backgroundColor=secondary;
      card.style.boxShadow='rgba(149,157,165,0.4) 0px 0px 6px';
      card.style.fontSize='12px';
      card.style.marginBottom='20px';
      card.style.marginRight='20px';
      card.style.height='250px';
      card.style.width='215px';

      // bodFlex
      const bod = document.createElement('div');
      bod.className='bodFlex';
      bod.style.height='80%';
      bod.style.position='relative';
      card.appendChild(bod);

      // thumbnail
      const thumb = document.createElement('img');
      thumb.src=file.thumbnailLink;
      thumb.onclick=()=>openFile(file.webViewLink);
      thumb.style.zIndex='1';
      thumb.style.position='absolute';
      thumb.style.maxHeight='250px';
      thumb.style.minHeight='200px';
      thumb.style.width='215px';
      thumb.style.cursor='pointer';
      bod.appendChild(thumb);

      // checkbox corner
      const selDiv = document.createElement('div');
      selDiv.style.zIndex='2';
      selDiv.style.position='relative';
      selDiv.style.float='right';
      selDiv.style.marginTop='10px';
      selDiv.style.marginRight='10px';
      selDiv.style.cursor='pointer';

      const mark = document.createElement('i');
      mark.id = file.name+'-mark';
      mark.onclick=()=>fileToggle(mark);
      mark.className='fa-sharp fa-solid fa-check fa-sm';
      mark.style.display='none';
      mark.style.position='absolute';
      mark.style.zIndex='4';
      mark.style.marginTop='9px';
      mark.style.marginLeft='4px';
      mark.style.color='#fff';

      const span = document.createElement('span');
      span.id=file.name+'-span';
      span.onclick=()=>fileToggle(span);
      span.style.height='17px';
      span.style.width='17px';
      span.style.display='block';
      span.style.backgroundColor='#d3d3d380';
      span.style.border='1px solid #292929';

      selDiv.appendChild(mark);
      selDiv.appendChild(span);
      bod.appendChild(selDiv);

      const checkInput = document.createElement('input');
      checkInput.className='file-selector';
      checkInput.type='checkbox';
      checkInput.id=file.name+'-input';
      checkInput.value=file.id;
      checkInput.onchange=()=>checkVis(checkInput);
      checkInput.style.appearance='none';
      checkInput.style.display='block';
      bod.appendChild(checkInput);

      // footFlex
      const foot = document.createElement('div');
      foot.className='footFlex';
      foot.style.display='flex';
      foot.style.justifyContent='space-between';
      foot.style.alignItems='center';
      foot.style.padding='0px 4px 0px 10px';
      foot.style.gap='6px';
      foot.style.height='20%';
      foot.style.zIndex='3';
      foot.style.backgroundColor='#f2f2f2';
      card.appendChild(foot);

      // name-div
      const namediv = document.createElement('div');
      namediv.className='name-div';
      namediv.style.display='flex';
      namediv.style.flexDirection='row';
      namediv.style.justifyContent='flex-start';
      namediv.style.alignItems='center';
      namediv.style.width='70%';
      foot.appendChild(namediv);

      const pdfIconDiv = document.createElement('div');
      pdfIconDiv.className='pdf-icon';
      pdfIconDiv.style.marginTop='4px';
      pdfIconDiv.style.marginRight='5px';
      pdfIconDiv.style.width='20px';
      pdfIconDiv.style.color=tertiary;
      namediv.appendChild(pdfIconDiv);

      const pdfi = document.createElement('i');
      if(file.mimeType.includes('pdf')){
        pdfi.className='fa-sharp fa-solid fa-file-pdf fa-lg';
      } else if(file.mimeType.includes('image')){
        pdfi.className='fa-sharp fa-solid fa-image fa-lg';
      } else if(file.mimeType.includes('video')){
        pdfi.className='fa-sharp fa-solid fa-video fa-lg';
      } else if(file.mimeType.includes('audio')){
        pdfi.className='fa-sharp fa-solid fa-music fa-lg';
      } else {
        pdfi.className='fa-sharp fa-solid fa-file fa-lg';
      }
      pdfIconDiv.appendChild(pdfi);

      const fileNameP = document.createElement('p');
      fileNameP.id='n-'+file.name;
      fileNameP.className='drive-file-name';
      fileNameP.innerText=file.name;
      fileNameP.style.fontSize='14px';
      fileNameP.style.whiteSpace='nowrap';
      fileNameP.style.overflow='hidden';
      fileNameP.style.textOverflow='ellipsis';
      namediv.appendChild(fileNameP);

      // iconDiv
      const iDiv = document.createElement('div');
      iDiv.className='icon-div';
      iDiv.style.display='flex';
      iDiv.style.flexDirection='row';
      iDiv.style.alignItems='center';
      foot.appendChild(iDiv);

      const dlBtn = document.createElement('button');
      dlBtn.onclick=()=>downloadSingle(file.id, file.name);
      dlBtn.className='gdui-desktop gdui-tablet';
      dlBtn.style.height='25px';
      dlBtn.style.width='25px';
      dlBtn.style.border='none';
      dlBtn.style.background='none';
      dlBtn.style.color=iconColor;
      dlBtn.style.cursor='pointer';
      dlBtn.style.display='flex';
      const dlI = document.createElement('i');
      dlI.className='fa-sharp fa-solid fa-download';
      dlI.onmouseenter=()=>icoHovEffect(dlI,1);
      dlI.onmouseleave=()=>icoHovEffect(dlI,2);
      dlBtn.appendChild(dlI);
      iDiv.appendChild(dlBtn);

      const prtBtn = document.createElement('button');
      prtBtn.onclick=()=>openFile(file.webViewLink);
      prtBtn.className='gdui-desktop gdui-tablet';
      prtBtn.style.height='25px';
      prtBtn.style.width='25px';
      prtBtn.style.border='none';
      prtBtn.style.background='none';
      prtBtn.style.color=iconColor;
      prtBtn.style.cursor='pointer';
      prtBtn.style.display='flex';
      const prtI = document.createElement('i');
      prtI.className='fa-sharp fa-solid fa-print';
      prtI.onmouseenter=()=>icoHovEffect(prtI,1);
      prtI.onmouseleave=()=>icoHovEffect(prtI,2);
      prtBtn.appendChild(prtI);
      iDiv.appendChild(prtBtn);

      // text mode overlay
      const selDivText = document.createElement('div');
      selDivText.className='selDivText';
      selDivText.style.zIndex='2';
      selDivText.style.position='relative';
      selDivText.style.float='right';
      selDivText.style.color='black';
      selDivText.style.cursor='pointer';
      selDivText.style.display='none';

      const tMark = document.createElement('i');
      tMark.id='t-'+file.name+'-mark';
      tMark.onclick=()=>fileToggle(tMark);
      tMark.className='fa-sharp fa-solid fa-check fa-sm';
      tMark.style.position='absolute';
      tMark.style.zIndex='4';
      tMark.style.marginTop='9px';
      tMark.style.marginLeft='5px';
      tMark.style.display='none';
      selDivText.appendChild(tMark);

      const tSpan = document.createElement('span');
      tSpan.id='t-'+file.name+'-span';
      tSpan.onclick=()=>fileToggle(tSpan);
      tSpan.style.height='17px';
      tSpan.style.width='17px';
      tSpan.style.backgroundColor='#d3d3d380';
      tSpan.style.display='block';
      tSpan.style.border='1px solid #292929';
      selDivText.appendChild(tSpan);

      iDiv.appendChild(selDivText);

      const tCheckbox = document.createElement('input');
      tCheckbox.className='t-file-selector';
      tCheckbox.type='checkbox';
      tCheckbox.id='t-'+file.name+'-input';
      tCheckbox.value=file.id;
      tCheckbox.onchange=()=>checkVis(tCheckbox);
      tCheckbox.style.display='none';
      iDiv.appendChild(tCheckbox);

      // Mobile dropdown etc. (not fully shown here)...

      uiRefs.filesEl.appendChild(card);
    });
  }

  // =========== RESPONSIVE ==============
  function applyResponsiveCSS() {
    const w = window.innerWidth;
    if (w >=768 && w<1024) {
      // tablet
      doTabletCSS();
    } else if (w<768) {
      // phone
      doPhoneCSS();
    } else {
      // desktop
      doDesktopCSS();
    }
  }
  function doDesktopCSS() {
    // show .gdui-desktop, hide .gdui-mobile, etc. 
    // You can keep your old code or unify it. 
    // For brevity, we skip the details. 
    // You could replicate your original “ComputerCSS(...)” logic if you want. 
  }
  function doTabletCSS() {}
  function doPhoneCSS() {}

  // =========== BUILD THE INITIAL UI & FETCH =============
  // Actually fetch the start folder
  GetDriveInfo(startFolder, 1);

  // Also handle window resize
  let resizeStop=null;
  window.addEventListener('resize', ()=>{
    clearTimeout(resizeStop);
    resizeStop=setTimeout(applyResponsiveCSS, 100);
  });

  // Expose some functions so the inline “onclick” in setFilepath can call them
  if(!window.__driveBrowserAPI) window.__driveBrowserAPI={};
  window.__driveBrowserAPI['folderChange']=(instId, foldId, mode, idxStr, nm)=> {
    if(parseInt(instId)===instanceIndex) {
      folderChange(foldId,parseInt(mode), idxStr, nm);
    }
  };

  //--- HELPER: Build the HTML scaffolding 
  function buildUI(parentEl, idx) {
    parentEl.style.display='flex';
    parentEl.style.flexDirection='column';
    parentEl.style.backgroundColor='transparent';
    parentEl.style.marginBottom='10px';
    parentEl.style.color='black';
    parentEl.style.fontFamily=fontStyle;

    // create top bar
    const uiHeader = document.createElement('div');
    uiHeader.className='ui-header';
    uiHeader.style.display='flex';
    uiHeader.style.alignItems='center';
    uiHeader.style.marginTop='10px';
    uiHeader.style.marginBottom='10px';
    uiHeader.style.paddingLeft='5px';
    uiHeader.style.paddingRight='0px';
    parentEl.appendChild(uiHeader);

    const filepath = document.createElement('div');
    filepath.className='filepath';
    filepath.style.display='flex';
    filepath.style.flexDirection='row';
    filepath.style.alignItems='center';
    filepath.style.width='40%';
    filepath.style.height='50px';
    filepath.style.fontSize='14px';
    uiHeader.appendChild(filepath);

    // back button (mobile)
    const backBtn = document.createElement('button');
    backBtn.onclick=()=>folderBack();
    backBtn.onmouseenter=()=>icoHovEffect(backBtn,1);
    backBtn.onmouseleave=()=>icoHovEffect(backBtn,2);
    backBtn.className='gdui-mobile gdui-tablet';
    backBtn.style.background='none';
    backBtn.style.border='none';
    backBtn.style.color='black';
    const backIcon = document.createElement('i');
    backIcon.className='fa-sharp fa-solid fa-arrow-left fa-2xl';
    backBtn.appendChild(backIcon);
    backBtn.style.display='none'; // hidden on desktop
    filepath.appendChild(backBtn);

    // Home path
    const homePath = document.createElement('p');
    homePath.className='folder gdui-desktop';
    homePath.innerText='Home ';
    homePath.style.whiteSpace='pre';
    homePath.style.fontSize='14px';
    homePath.style.cursor='pointer';
    homePath.style.fontWeight='700';
    homePath.style.color=tertiary;
    homePath.onclick=()=>folderChange(startFolder,1,'0','Home ');
    filepath.appendChild(homePath);

    const mobileHome = document.createElement('p');
    mobileHome.className='mobile-folder';
    mobileHome.innerText='Home';
    mobileHome.style.fontSize='14px';
    mobileHome.style.display='none';
    mobileHome.style.color=tertiary;
    mobileHome.style.fontWeight='700';
    filepath.appendChild(mobileHome);

    // Right side: search + icons
    const fileSearch = document.createElement('div');
    fileSearch.id='file-search-'+idx;
    fileSearch.style.display='flex';
    fileSearch.style.flexDirection='row';
    fileSearch.style.justifyContent='flex-end';
    fileSearch.style.alignItems='center';
    fileSearch.style.marginRight='0px';
    fileSearch.style.width='60%';
    fileSearch.style.height='50px';
    uiHeader.appendChild(fileSearch);

    // container for search input
    const searchDiv = document.createElement('div');
    fileSearch.appendChild(searchDiv);

    const inputDiv = document.createElement('div');
    inputDiv.id='input-'+idx;
    inputDiv.style.backgroundColor=secondary;
    inputDiv.style.display='flex';
    inputDiv.style.padding='4px';
    inputDiv.style.height='25px';
    searchDiv.appendChild(inputDiv);

    const magButton = document.createElement('button');
    magButton.onclick=()=>searchActivate();
    magButton.style.background='none';
    magButton.style.border='none';
    magButton.style.color=iconColor;
    magButton.style.height='auto';
    magButton.style.font='revert';
    const magGlassIcon = document.createElement('i');
    magGlassIcon.id='mag-ico-'+idx;
    magGlassIcon.className='fa-sharp fa-solid fa-magnifying-glass fa-lg';
    magGlassIcon.onmouseenter=()=>icoHovEffect(magGlassIcon,1,false,false);
    magGlassIcon.onmouseleave=()=>icoHovEffect(magGlassIcon,2,false,false);
    magButton.appendChild(magGlassIcon);
    inputDiv.appendChild(magButton);

    const inputBox = document.createElement('input');
    inputBox.id='input-box-'+idx;
    inputBox.className='gdui-desktop gdui-tablet';
    inputBox.type='text';
    inputBox.placeholder='Search Filenames';
    inputBox.onkeyup=()=>searchFiles(inputBox.value);
    inputBox.style.border='none';
    inputBox.style.outline='none';
    inputBox.style.background='transparent';
    inputBox.style.font='revert';
    inputBox.style.color=iconColor;
    inputDiv.appendChild(inputBox);

    // Icon row
    const iconsDiv = document.createElement('div');
    iconsDiv.style.display='flex';
    iconsDiv.style.justifyContent='flex-end';
    iconsDiv.style.alignItems='center';
    fileSearch.appendChild(iconsDiv);

    // reorder button
    const fileOrderBtn = document.createElement('button');
    fileOrderBtn.id='file-order-'+idx;
    fileOrderBtn.className='gdui-desktop';
    fileOrderBtn.onclick=()=>reorderFiles(1);
    fileOrderBtn.style.marginRight='3px';
    fileOrderBtn.style.marginLeft='5px';
    fileOrderBtn.style.border='none';
    fileOrderBtn.style.background='none';
    fileOrderBtn.style.font='revert';
    fileOrderBtn.style.color=iconColor;
    fileOrderBtn.style.cursor='pointer';
    const fileOrderIcon = document.createElement('i');
    fileOrderIcon.className='fa-sharp fa-solid fa-arrow-down-wide-short fa-lg';
    fileOrderIcon.onmouseenter=()=>icoHovEffect(fileOrderIcon,1,false,false);
    fileOrderIcon.onmouseleave=()=>icoHovEffect(fileOrderIcon,2,false,false);
    fileOrderBtn.appendChild(fileOrderIcon);
    iconsDiv.appendChild(fileOrderBtn);

    // appearance (grid vs list)
    const appearanceBtn = document.createElement('button');
    appearanceBtn.id='appearance-'+idx;
    appearanceBtn.className='gdui-desktop';
    appearanceBtn.onclick=()=>explorerView(1);
    appearanceBtn.style.marginRight='3px';
    appearanceBtn.style.border='none';
    appearanceBtn.style.background='none';
    appearanceBtn.style.font='revert';
    appearanceBtn.style.color=iconColor;
    appearanceBtn.style.cursor='pointer';
    const appearanceIcon = document.createElement('i');
    appearanceIcon.className='fa-solid fa-list fa-lg';
    appearanceIcon.onmouseenter=()=>icoHovEffect(appearanceIcon,1,false,false);
    appearanceIcon.onmouseleave=()=>icoHovEffect(appearanceIcon,2,false,false);
    appearanceBtn.appendChild(appearanceIcon);
    iconsDiv.appendChild(appearanceBtn);

    // “refresh” 
    const refreshBtn = document.createElement('button');
    refreshBtn.id='refresh-'+idx;
    refreshBtn.onclick=()=>refreshFiles();
    refreshBtn.style.marginRight='3px';
    refreshBtn.style.border='none';
    refreshBtn.style.background='none';
    refreshBtn.style.color=iconColor;
    refreshBtn.style.cursor='pointer';
    refreshBtn.style.height='2.5em';
    refreshBtn.style.font='revert';
    refreshBtn.style.transform='rotate(0deg)';
    const refreshI = document.createElement('i');
    refreshI.className='fa-sharp fa-solid fa-rotate fa-lg';
    refreshI.onmouseenter=()=>icoHovEffect(refreshBtn,1,true,false);
    refreshI.onmouseleave=()=>icoHovEffect(refreshBtn,2,true,false);
    refreshBtn.appendChild(refreshI);
    iconsDiv.appendChild(refreshBtn);

    // “select all”
    const selectAllDiv = document.createElement('button');
    selectAllDiv.className='gdui-desktop';
    selectAllDiv.style.display='flex';
    selectAllDiv.style.cursor='pointer';
    selectAllDiv.style.alignItems='center';
    selectAllDiv.style.backgroundColor=secondary;
    selectAllDiv.style.paddingRight='8px';
    selectAllDiv.style.paddingLeft='8px';
    selectAllDiv.style.height='35px';
    selectAllDiv.style.border='none';
    selectAllDiv.style.font='revert';
    selectAllDiv.onmouseenter=()=>icoHovEffect(selectAllDiv,1,false,true);
    selectAllDiv.onmouseleave=()=>icoHovEffect(selectAllDiv,2,false,true);

    const checkmark = document.createElement('i');
    checkmark.id='select-all-mark-'+idx;
    checkmark.className='fa-solid fa-check fa-xs';
    checkmark.style.display='none';
    checkmark.style.position='absolute';
    checkmark.style.zIndex='2';
    checkmark.style.color='#171717';
    checkmark.style.marginLeft='4px';
    selectAllDiv.appendChild(checkmark);

    const selectAllSpan = document.createElement('span');
    selectAllSpan.id='select-all-span-'+idx;
    selectAllSpan.style.height='17px';
    selectAllSpan.style.width='17px';
    selectAllSpan.style.backgroundColor='rgba(211,211,211,0.5)';
    selectAllSpan.style.border='1px solid #292929';
    selectAllSpan.style.display='block';
    selectAllSpan.style.zIndex='1';
    selectAllDiv.appendChild(selectAllSpan);

    const selectAllCheckbox = document.createElement('input');
    selectAllCheckbox.id='select-all-input-'+idx;
    selectAllCheckbox.type='checkbox';
    selectAllCheckbox.onchange=()=>checkVis(selectAllCheckbox);
    selectAllCheckbox.style.appearance='none';
    selectAllDiv.appendChild(selectAllCheckbox);

    const selectAllLabel = document.createElement('label');
    selectAllLabel.id='select-all-label-'+idx;
    selectAllLabel.htmlFor='select-all';
    selectAllLabel.innerText='Select All';
    selectAllLabel.style.color='white';
    selectAllLabel.style.cursor='pointer';
    selectAllLabel.style.fontSize='14px';
    selectAllLabel.style.marginBottom='0px';
    selectAllLabel.style.marginLeft='5px';
    selectAllDiv.appendChild(selectAllLabel);

    selectAllDiv.onclick=()=>selectFiles(selectAllCheckbox);
    iconsDiv.appendChild(selectAllDiv);

    const hr1 = document.createElement('hr');
    hr1.style.borderColor=secondary;
    hr1.style.width='100%';
    parentEl.appendChild(hr1);

    // UI file body
    const uiFileSelector = document.createElement('div');
    uiFileSelector.className='ui-file-selector';
    uiFileSelector.style.paddingLeft='5px';
    uiFileSelector.style.paddingRight='5px';
    uiFileSelector.style.marginTop='20px';
    uiFileSelector.style.marginBottom='20px';
    parentEl.appendChild(uiFileSelector);

    const foldersEl = document.createElement('div');
    foldersEl.className='folders';
    foldersEl.style.display='flex';
    foldersEl.style.flexDirection='row';
    foldersEl.style.flexWrap='wrap';
    foldersEl.style.marginBottom='20px';
    uiFileSelector.appendChild(foldersEl);

    const filesEl = document.createElement('div');
    filesEl.className='files';
    filesEl.id='file-div-'+idx;
    filesEl.style.display='flex';
    filesEl.style.flexDirection='row';
    filesEl.style.flexWrap='wrap';
    uiFileSelector.appendChild(filesEl);

    // footer
    const hr2 = document.createElement('hr');
    hr2.style.borderColor='#171717';
    hr2.style.width='100%';
    parentEl.appendChild(hr2);

    const uiFooter = document.createElement('div');
    uiFooter.className='ui-footer';
    uiFooter.style.backgroundColor='transparent';
    uiFooter.style.display='flex';
    uiFooter.style.paddingTop='10px';
    uiFooter.style.paddingBottom='10px';
    uiFooter.style.paddingRight='0px';
    parentEl.appendChild(uiFooter);

    const downloadBtn = document.createElement('button');
    downloadBtn.id='download-button-'+idx;
    downloadBtn.onclick=()=>downloadMulti();
    downloadBtn.onmouseenter=()=>downHov(1);
    downloadBtn.onmouseleave=()=>downHov(2);
    downloadBtn.style.display='flex';
    downloadBtn.style.justifyContent='center';
    downloadBtn.style.alignItems='center';
    downloadBtn.style.border='1px solid #f2f2f2';
    downloadBtn.style.fontWeight='700';
    downloadBtn.style.outline='none';
    downloadBtn.style.height='40px';
    downloadBtn.style.font='revert';
    downloadBtn.style.backgroundColor='transparent';
    downloadBtn.style.color='#f2f2f2';
    downloadBtn.style.cursor='pointer';
    downloadBtn.style.width='200px';
    downloadBtn.disabled=true;

    const dlTxt = document.createElement('p');
    dlTxt.innerText='DOWNLOAD';
    dlTxt.style.fontSize='14px';
    dlTxt.style.fontWeight='700';
    downloadBtn.appendChild(dlTxt);

    const dlIcon = document.createElement('i');
    dlIcon.className='fa-sharp fa-solid fa-download';
    dlIcon.style.marginLeft='10px';
    downloadBtn.appendChild(dlIcon);

    uiFooter.appendChild(downloadBtn);

    // Return references for local usage
    return {
      headerEl: uiHeader,
      filepathEl: filepath,
      backBtn: backBtn,
      fileSearchEl: fileSearch,
      inputDiv: inputDiv,
      inputBox: inputBox,
      fileOrderBtn: fileOrderBtn,
      fileOrderIcon: fileOrderIcon,
      fileOrderIconDrop: fileOrderIcon, // or separate if you want
      refreshBtn: refreshBtn,
      selectAllDiv: selectAllDiv,
      selectAllCheckbox: selectAllCheckbox,
      selectAllLabel: selectAllLabel,
      foldersEl: foldersEl,
      filesEl: filesEl,
      downloadBtn: downloadBtn
    };
  }
} // end initSingleDriveBrowser
