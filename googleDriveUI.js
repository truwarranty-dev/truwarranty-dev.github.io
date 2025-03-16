const googDiv = document.getElementById("googleDrive");
var arrayPath = [googDiv.dataset.folder];
var ascending = true;
var textIcons = false;
var primary = '#ffffff';
var secondary = '#f2f2f2';
var tertiary = '#000000';
var iconColor = 'black';
//var primary = '#090909';
//var secondary = '#222222';
//var tertiary = '#B12127';
//var iconColor = 'white';
var fontStyle = "'Roboto', sans-serif";


//interface functions
//search through visible files for those whose innerText matches the user input
function searchActivate() {
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
        };
    };
};
function searchFiles(input) {
    var filesSearch = files.getElementsByClassName('goog-drive-file');
    for (i = 0; i < filesSearch.length; i++) {
        if (input === '') {
            filesSearch[i].style.display = 'flex';
        } else {
            if (!textIcons) {
                const fileSelector = filesSearch[i].getElementsByClassName('file-selector');
                if (filesSearch[i].id.toLowerCase().includes(input.toLowerCase())) {
                    filesSearch[i].style.display = 'flex';
                    fileSelector[0].style.display = 'block';
                } else {
                    filesSearch[i].style.display = 'none';
                    fileSelector[0].checked = false;
                    fileSelector[0].style.display = 'none';
                };
            } else {
                    const fileSelector = filesSearch[i].getElementsByClassName('t-file-selector');
                if (filesSearch[i].id.toLowerCase().includes(input.toLowerCase())) {
                    filesSearch[i].style.display = 'flex';
                    fileSelector[0].style.display = 'block';
                } else {
                    filesSearch[i].style.display = 'none';
                    fileSelector[0].checked = false;
                    fileSelector[0].style.display = 'none';
                };
            }
        };
    };
};
//change file order from ascending to descending or vice-versa
function reorderFiles(num, response = 0) {
    //Sort ascending if ascending value is true
    switch(num) {
        case 1:
            ascending = !ascending;
            filesToArrange = Array.prototype.slice.call(files.getElementsByClassName('goog-drive-file'));

            if (ascending) {
                fileOrderIcon.setAttribute('class', 'fa-sharp fa-solid fa-arrow-down-wide-short fa-lg');
                fileOrderIconDrop.setAttribute('class', 'fa-sharp fa-solid fa-arrow-down-wide-short fa-2xl drop-element');
                filesToArrange.sort((a, b) => {
                    if (a.id && b.id) {
                        return a.id.toLowerCase() > b.id.toLowerCase() ? 1: -1;
                    };
                    return 0;
                }).forEach((val) => {
                    files.appendChild(val)
                });
            } else {
                fileOrderIcon.setAttribute('class', 'fa-sharp fa-solid fa-arrow-up-wide-short fa-lg');
                fileOrderIconDrop.setAttribute('class', 'fa-sharp fa-solid fa-arrow-up-wide-short fa-2xl drop-element');
                filesToArrange.sort((a, b) => {
                    if (a.id && b.id) {
                        return a.id.toLowerCase() < b.id.toLowerCase() ? 1: -1;
                    };
                }).forEach((val) => {
                    files.appendChild(val)
                });
                return 0;
            };
            return;
        case 2:
            if (ascending) {
                response.sort((a, b) => {
                    if (a.name && b.name) {
                        return a.name.toLowerCase() > b.name.toLowerCase() ? 1: -1;
                    };
                    return 0;
                });
            } else {
                response.sort((a, b) => {
                    if (a.name && b.name) {
                        return a.name.toLowerCase() < b.name.toLowerCase() ? 1: -1;
                    };
                    return 0;
                });
            };
            return response;
        default:
            console.error('unexpected num val passed');
    };
};
//change file visual representation
function explorerView(num = 0) {
    const viewImage = Array.prototype.slice.call(files.getElementsByClassName('file-selector'));
    const viewText = Array.prototype.slice.call(files.getElementsByClassName('t-file-selector'));
    const bodFlex = Array.prototype.slice.call(files.getElementsByClassName('bodFlex'));
    const selDivText = Array.prototype.slice.call(files.getElementsByClassName('selDivText'));
    const fileBox = Array.prototype.slice.call(files.getElementsByClassName('goog-drive-file'));
    const footFlex = Array.prototype.slice.call(files.getElementsByClassName('footFlex'));
    const nameDiv = Array.prototype.slice.call(files.getElementsByClassName('name-div'));
    const iconDiv = Array.prototype.slice.call(files.getElementsByClassName('icon-div'));


    if (num === 1) {
        textIcons = !textIcons;
    }

    if (selectAll.checked === true) {
        selectAll.click();
    };

    if (selectAllDrop.checked === true) {
        selectAllDrop.click();
    };

    viewImage.forEach((box) => {
        if (box.checked === true) {
            box.click();
        };
    });
    viewText.forEach((box) => {
        if (box.checked === true) {
            box.click();
        };
    });

    if (textIcons) {
        bodFlex.forEach((body) => {
            body.style.display = 'none';
        });
        selDivText.forEach((selDiv) => {
            selDiv.style.display = '';
        });
        fileBox.forEach((box) => {
            box.style.height = '50px';
            box.style.width = '100%';
        });
        footFlex.forEach((box) =>{
            box.style.height = '100%';
            box.style.zIndex = '';
        });
        nameDiv.forEach((box) => {
            box.style.marginLeft = '10px';
        });
        iconDiv.forEach((box) => {
            box.style.marginRight = '10px';
        });

    } else {
        bodFlex.forEach((body) => {
            body.style.display = '';
        });
        selDivText.forEach((selDiv) => {
            selDiv.style.display = 'none';
        });
        fileBox.forEach((box) => {
            box.style.height = '250px';
            box.style.width = '220px';
        });
        footFlex.forEach((box) =>{
            box.style.zIndex = '3'
            if (window.innerWidth < 768) {
                box.style.height = '35%';
            } else {
                box.style.height = '20%'
            }
        });
        nameDiv.forEach((box) => {
            box.style.marginLeft = '5px';
        });
        iconDiv.forEach((box) => {
            box.style.marginRight = '5px';
        });    };
};
//Remove files then regrab jsonResponse from google drive and apply fresh data
function refreshFiles() {
    while (files.firstChild) {
        files.removeChild(files.firstChild);
    };

    inputBox.value = '';

    GetDriveInfo(arrayPath[arrayPath.length - 1], 2);
};
//set all files to be selected or unselected
function selectFiles(id, num = 0) {
    const inputBox = document.getElementById(id);
    inputBox.click(); 

    var checkState = inputBox.checked;
    if (!textIcons) {
        var togChecks = files.getElementsByClassName('file-selector');
    } else {
        var togChecks = files.getElementsByClassName('t-file-selector');
    }

    if (checkState === true) {
        //toggle on all checkboxes on screen
        for (const box of togChecks) {
            if ((box.checked === false)) {
                box.click();
            };
        };

    } else if (checkState === false) {
        //toggle off all visible checkboxes
        for (const box of togChecks) {
            if ((box.checked === true)) {
                box.click();
            };
        };
    };
};
//control visual aspect of checkbox
function checkVis(check) {
    var str = check.id.slice(0, check.id.length-6);
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
        };
    };

    setDownAccess();
};
function fileToggle(select) {
    var str = select.id.slice(0, select.id.length-5);
    const input = document.getElementById(`${str}-input`);
    if (input) {
        input.click();
        checkVis(input);
    };
};
//Enables download button when at least one file checked else disables
function setDownAccess() {
    if (!textIcons) {
        var togChecks = files.getElementsByClassName('file-selector');
    } else {
        var togChecks = files.getElementsByClassName('t-file-selector');
    }

    for (var check of togChecks) {
        if (check.checked) {
            //enable download
            downloadButton.disabled = false;
            downloadButton.style.backgroundColor = tertiary;
            downloadButton.style.cursor = 'pointer';
            break;
        } else {
            //disable download button
            downloadButton.disabled = true;
            downloadButton.style.backgroundColor = 'transparent';           
            downloadButton.style.cursor = '';
        };
    };
};
//Set the filepath in the header
function setFilepath(id, num, foldID, name) {
    var folderArray = Array.prototype.slice.call(filepath.getElementsByClassName('folder'));
    var mobileArray = Array.prototype.slice.call(filepath.getElementsByClassName('mobile-folder'));
    switch (num) {
        case 1:
            //Remove everything after current folder in filepath if name exists in path
            for (var i = (parseInt(foldID)); i < folderArray.length - 1; i++) {
                arrayPath.pop();
                if(filepath.lastElementChild !== null) {
                    filepath.removeChild(filepath.lastElementChild);
                    filepath.removeChild(filepath.lastElementChild);
                    filepath.removeChild(filepath.lastElementChild);                                      
                } else {
                    break;
                };
            };
            break;
        case 2:
            //Append new folder to filepath
            arrayPath.push(id);

            const slashPath = document.createElement('p');
            filepath.appendChild(slashPath);
            slashPath.setAttribute('class', 'slash gdui-desktop');
            slashPath.style.setProperty('font-size', '14px', 'important');
            slashPath.innerText = '/';
            
            const newPath = document.createElement('p');
            filepath.appendChild(newPath);
            newPath.setAttribute('id', folderArray.length);
            newPath.setAttribute('class', 'folder gdui-desktop');
            newPath.innerText = ' ' + name + ' ';
            newPath.setAttribute('onclick', `folderChange('${id}', 1, this.id, this.innerText)`);
            newPath.style.setProperty('font-size', '14px', 'important');
            newPath.style.setProperty('white-space', 'pre', 'important');
            newPath.style.cursor = 'pointer';

            const mobilePath = document.createElement('p');
            filepath.appendChild(mobilePath);
            mobilePath.setAttribute('class', 'mobile-folder');
            mobilePath.style.setProperty('font-size', '14px', 'important');
            mobilePath.innerText = name;

            if (window.innerWidth >=  1024) {
                slashPath.style.display = 'flex';
                newPath.style.display = 'flex';
                mobilePath.style.display = 'none';
            } else {
                slashPath.style.display = 'none';
                newPath.style.display = 'none';
                mobilePath.style.display = 'flex';
            };

            mobileArray.forEach((path, index) => {
                if (index !== mobileArray.length) {
                    path.style.display = 'none';
                };
            });


            break;
        default:
            console.error('Failed to set filepath');
    };

    var pathArray = Array.from(filepath.children);
    for (var i = 0; i < pathArray.length; i++) {
        if (i >= (pathArray.length - 2)) {
            pathArray[i].style.color = tertiary;
            pathArray[i].style.fontWeight = '700';
        } else {
            pathArray[i].style.color = '#171717'
            pathArray[i].style.fontWeight = '500';
            backBtn.style.color = iconColor;
        }
    };
};
//change accessed folder
function folderChange(id, num, foldID = 0, name = '') {
    inputBox.value = '';
    //change filepath
    setFilepath(id, num, foldID, name);

    //remove on screen folders and files
    while (folders.firstChild) {
        folders.removeChild(folders.firstChild);
    };
    while (files.firstChild) {
        files.removeChild(files.firstChild);
    };
    //clear search (do this later)
    GetDriveInfo(arrayPath[foldID], 1);
};
//Go back to previous folder
function folderBack() {
    const pathing = Array.prototype.slice.call(filepath.getElementsByClassName('folder'));
    if (arrayPath.length > 1) {
        const lastPath = pathing[pathing.length - 2];
        
        //change folder and set filepath
        lastPath.click();
        
    };
};
//open the file in a different window
function openFile(link, num = 0) {
    window.open(link, '_blank');
};
//hover effect for folders and files
function hoverEffect(el, num) { 
    switch (num) {
        case 1:
            const elFoot = el.getElementsByClassName('footFlex');
            const pdfIcon = el.getElementsByClassName('pdf-icon');
            
            if (elFoot[0].style.backgroundColor === '#f2f2f2') {
                el.style.zIndex = '10'
                elFoot[0].style.backgroundColor = tertiary;
                pdfIcon[0].style.color = iconColor;
                if (!textIcons) {
                    el.style.transform = 'scale(1.1)';
                } else {
                    el.style.transform = 'scale(1.05)';
                }
            } else {
                el.style.zIndex = '';
                elFoot[0].style.backgroundColor = '#f2f2f2';
                pdfIcon[0].style.color = tertiary;
                el.style.transform = '';

            }
            break;
        case 2:
            if (el.style.backgroundColor === '#f2f2f2') {
                el.style.backgroundColor = tertiary;
                el.style.transform = 'scale(1.08)';
            } else {
                el.style.backgroundColor = '#f2f2f2';
                el.style.transform = '';
            }
            break;
        default:
            console.error('Hover effect failed to execute.')
            
    }
};
//hover effects for icons
function icoHovEffect(el, num, reIco = false, selDiv = false) {
    switch (num) {
        case 1:
            if (reIco === true) {
                if (refresh.style.transform === 'rotate(0deg)') {
                    const timer = ms => new Promise(res => setTimeout(res, ms))
                    async function anim() {
                        for (var i = 1; i < 360;) {
                            refresh.style.transform =  `rotate(${i}deg)`;
                            await timer(1);
                            i = i + 4;
                        }
                        refresh.style.transform = 'rotate(0deg)';
                    }
                    anim();
                };
            };

            if ((el.id !== magGlassIcon.id) || ((el.id === magGlassIcon.id) && (window.innerWidth < 768))) {
                if (selDiv === true) {
                    selectLabel.style.color = `#989898`;
                } else {
                    el.style.color = `#989898`;
                };
            }

            break;
        case 2:
            if (selDiv === true) {
                selectLabel.style.color = iconColor;
            } else {
                el.style.color = iconColor;
            };

            break;
        default:
            console.error('Failed to initiate hover effect');
    }
};
//hover effect for download button
function downHov(num) {
    switch (num) {
        case 1:
            downloadButton.style.color = iconColor;
            break;
        case 2:
            downloadButton.style.color = '#f2f2f2';
            break;
        default:
            console.error('Hover effect on download button failed');
    }
};
//download multiple files from google drive
async function downloadMulti() {
    if (!textIcons) {
        var filesToDownload = files.getElementsByClassName('file-selector');
    } else {
        var filesToDownload = files.getElementsByClassName('t-file-selector');
    }
    for (let i = 0; i < filesToDownload.length; i++) {
        if (filesToDownload[i].checked && (filesToDownload[i].style.display !== 'none')) {
            const urlForFile = 'https://www.googleapis.com/drive/v3/files/' + filesToDownload[i].value + 
                '?alt=media&key=' + googDiv.dataset.apikey;
            const fileName = filesToDownload[i].id.slice(0, filesToDownload[i].id.length - 6);

            xhrRequest();
            async function xhrRequest() {
                try {
                    xhr[i] = new XMLHttpRequest();
                    xhr[i].responseType = 'blob';
                    xhr[i].open("GET", urlForFile, true);
                    xhr[i].onload = () => {
                        const b = document.createElement('a'); 
                        b.href = window.URL.createObjectURL(xhr[i].response); 
                        b.download = fileName;
                        b.style.display = 'none';
                        document.body.appendChild(b);
                        b.click();
                        b.remove();
                    };
                    await xhr[i].send(null);
                } catch (error) {
                    console.error('Download request failed with error: ', error);
                }
            };
        };
    };
};
//download a single file from google drive
async function downloadSingle(id, name) {
    const urlForFile = 'https://www.googleapis.com/drive/v3/files/' + id + 
                '?alt=media&key=' + googDiv.dataset.apikey;
    try {
        xhr = new XMLHttpRequest();
        xhr.open("GET", urlForFile);
        xhr.responseType = 'blob';
        xhr.onload = () => {
            const b = document.createElement('a'); 
            b.href = window.URL.createObjectURL(xhr.response); 
            b.download = name;
            b.style.display = 'none';
            document.body.appendChild(b);
            b.click();
        }
        await xhr.send(null);
    } catch (error) {
        console.error('Download request failed with error: ', error);
    };
}
function dropDownEnd(event) {
    if (!event.target.classList.contains('drop-element')) {
        const dropmenus = Array.prototype.slice.call(document.getElementsByClassName('dropmenu'));
        dropmenus.forEach((val) => {
            if (val.style.display !== 'none') {
                val.style.display = 'none';
            };
        });
    window.removeEventListener('click', dropDownEnd);
    };
};
//activate dropdown menu
function dropClick(fileName) {
    const targetDropMenu = document.getElementById(`${fileName}-dropmenu`);

    if (targetDropMenu.style.display === 'none') {
        targetDropMenu.style.display = 'flex';
        window.addEventListener('click', dropDownEnd);
    } else {
        targetDropMenu.style.display = 'none';
    };
};
//Get folders and files from Google Drive and create html tags for them
function setFolders(jsonResponse) {
    var googFolders = [];
    jsonResponse.files.forEach((val) => {
        if (val.mimeType === 'application/vnd.google-apps.folder') {
            googFolders.push(val);
        }
    });

    if (arrayPath.length > 1) {
        const backFold = document.createElement('div');
        folders.appendChild(backFold);
        backFold.setAttribute('onclick', `folderBack()`);
        backFold.setAttribute('onmouseenter', 'hoverEffect(this, 2)');
        backFold.setAttribute('onmouseleave', 'hoverEffect(this, 2)');
        backFold.setAttribute('class', 'goog-folder');
        backFold.style.setProperty('margin-bottom', '20px', 'important');
        backFold.style.setProperty('box-shadow', 'rgba(149, 157, 165, 0.4) 0px 0px 6px', 'important');
        backFold.style.setProperty('font-size', '12px', 'important');
        backFold.style.setProperty('transition', 'all .2s ease-in-out', 'important');
        backFold.style.setProperty('color', '#000000', 'important');
        backFold.style.setProperty('font-weight', '500', 'important');
        backFold.style.width = '215px';
        backFold.style.backgroundColor = '#f2f2f2';
        backFold.style.cursor = 'pointer';

            const deskVersion = document.createElement('div');
            backFold.appendChild(deskVersion);
            deskVersion.setAttribute('class', 'gdui-desktop gdui-tablet');
            deskVersion.style.setProperty('height', '100%', 'important');
            deskVersion.style.setProperty('justify-content', 'space-between', 'important');
            deskVersion.style.setProperty('align-items', 'center', 'important');
            deskVersion.style.setProperty('min-height', '40px', 'important');
            deskVersion.style.display = 'flex';

                const backVis = document.createElement('div');
                deskVersion.appendChild(backVis);
                backVis.style.setProperty('justify-content', 'center', 'important');
                backVis.style.setProperty('align-items', 'center', 'important');
                backVis.style.setProperty('padding-left', '10px', 'important');
                backVis.style.display = 'flex';

                    const backArrow = document.createElement('i');
                    backVis.appendChild(backArrow);
                    backArrow.setAttribute('class', 'fa-solid fa-sharp fa-arrow-left fa-2xl');
                    backArrow.style.setProperty('color', '#292929', 'important');
                    backArrow.style.setProperty('font-size', '3em', 'important');

                    const prevFold = document.createElement('p');
                    backVis.appendChild(prevFold);
                    prevFold.innerText = 'Previous Folder';
                    prevFold.style.setProperty('margin-left', '10px', 'important');
                    prevFold.style.setProperty('font-size', '14px', 'important');

            const mobVersion = document.createElement('div')
            backFold.appendChild(mobVersion);
            mobVersion.setAttribute('class', 'gdui-mobile');
            mobVersion.style.setProperty('flex-direction', 'column', 'important');
            mobVersion.style.setProperty('justify-content', 'space-between', 'important');
            mobVersion.style.setProperty('align-items', 'center', 'important');
            mobVersion.style.setProperty('min-height', '40px', 'important');
            mobVersion.style.display = 'none';

                const arrowDiv = document.createElement('div');
                mobVersion.appendChild(arrowDiv);
                arrowDiv.style.setProperty('margin-top', '10px', 'important');
                arrowDiv.style.setProperty('color', '#292929', 'important');
                arrowDiv.style.setProperty('font-size', '4em', 'important');
                
                    const backArrowM = document.createElement('i');
                    arrowDiv.appendChild(backArrowM);
                    backArrowM.setAttribute('class', 'fa-solid fa-sharp fa-arrow-left');

                const prevFoldM = document.createElement('p');
                mobVersion.appendChild(prevFoldM);
                prevFoldM.innerText = 'Previous Folder';
                prevFoldM.style.setProperty('font-size', '14px', 'important');
                prevFoldM.style.setProperty('margin-left', '10px', 'important');
    };

    for (const folder of googFolders) {
        const folderViewer = document.createElement('div');
        folders.appendChild(folderViewer);
        folderViewer.setAttribute('onclick', `folderChange('${folder.id}', 2, ${arrayPath.length}, '${folder.name}')`);
        folderViewer.setAttribute('class', 'goog-folder');
        folderViewer.setAttribute('onmouseenter', 'hoverEffect(this, 2)');
        folderViewer.setAttribute('onmouseleave', 'hoverEffect(this, 2)');
        folderViewer.style.setProperty('margin-right', '20px', 'important');
        folderViewer.style.setProperty('margin-bottom', '20px', 'important');
        folderViewer.style.setProperty('box-shadow', 'rgba(149, 157, 165, 0.4) 0px 0px 6px', 'important');
        folderViewer.style.setProperty('font-size', '12px', 'important');
        folderViewer.style.setProperty('transition', 'all .2s ease-in-out', 'important');
        folderViewer.style.setProperty('min-height', '40px', 'important');
        folderViewer.style.width = '215px';
        folderViewer.style.backgroundColor = '#f2f2f2';
        folderViewer.style.cursor = 'pointer';

            const desktopVer = document.createElement('div');
            folderViewer.appendChild(desktopVer);
            desktopVer.setAttribute('class', 'deskVer gdui-desktop gdui-tablet');
            desktopVer.style.setProperty('justify-content', 'space-between', 'important');
            desktopVer.style.setProperty('align-items', 'center', 'important');
            desktopVer.style.setProperty('min-height', '40px', 'important');
            desktopVer.style.display = 'flex';

                const folderInfo = document.createElement('div');
                desktopVer.appendChild(folderInfo);
                folderInfo.style.setProperty('justify-content', 'center', 'important');
                folderInfo.style.setProperty('align-items', 'center', 'important');
                folderInfo.style.setProperty('padding-left', '10px', 'important');
                folderInfo.style.display = 'flex';

                    const folderIcon = document.createElement('i');
                    folderInfo.appendChild(folderIcon);
                    folderIcon.setAttribute('class', 'fa-solid fa-sharp fa-folder-closed fa-2xl');
                    folderIcon.style.setProperty('color', '#292929', 'important');

                    const foldName = document.createElement('p');
                    folderInfo.appendChild(foldName);
                    foldName.innerText = folder.name;
                    foldName.style.setProperty('margin-left', '10px', 'important');
                    foldName.style.setProperty('font-size', '14px', 'important');

                const openIcon = document.createElement('i');
                desktopVer.appendChild(openIcon);
                openIcon.setAttribute('class', 'fa-sharp fa-solid fa-chevron-down');
                openIcon.style.setProperty('padding-right', '10px', 'important');

            const mobileVer = document.createElement('div')
            folderViewer.appendChild(mobileVer);
            mobileVer.setAttribute('class', 'mobileVer gdui-mobile');
            mobileVer.style.display = 'none';
            mobileVer.style.setProperty('flex-direction', 'column', 'important');
            mobileVer.style.setProperty('justify-content', 'space-between', 'important');
            mobileVer.style.setProperty('align-items', 'center', 'important');
            mobileHome.style.setProperty('min-height', '40px', 'important');

                const folderIconDiv = document.createElement('div');
                mobileVer.appendChild(folderIconDiv);
                folderIconDiv.style.setProperty('margin-top', '10px', 'important');
                folderIconDiv.style.setProperty('color', '#292929', 'important');
                folderIconDiv.style.setProperty('font-size', '4em', 'important');
                
                    const folderIconM = document.createElement('i');
                    folderIconDiv.appendChild(folderIconM);
                    folderIconM.setAttribute('class', 'fa-solid fa-sharp fa-folder-closed');

                const folderInfoM = document.createElement('div');
                mobileVer.appendChild(folderInfoM);
                folderInfoM.style.display = 'flex';
                folderInfoM.style.setProperty('justify-content', 'space-around', 'important');
                folderInfoM.style.setProperty('align-items', 'center', 'important');
                folderInfoM.style.setProperty('padding-left', '10px', 'important');
                folderInfoM.style.setProperty('width', '100%', 'important');

                    const foldNameM = document.createElement('p');
                    folderInfoM.appendChild(foldNameM);
                    foldNameM.innerText = folder.name;
                    foldNameM.style.setProperty('margin-left', '10px', 'important');
                    foldNameM.style.setProperty('font-size', '14px', 'important');

                    const openIconM = document.createElement('i');
                    folderInfoM.appendChild(openIconM);
                    openIconM.setAttribute('class', 'fa-sharp fa-solid fa-chevron-down');
    };

};
function setFiles(jsonResponse) {
    var googFiles = [];
    jsonResponse.files.forEach((val) => {
        if (val.mimeType !== 'application/vnd.google-apps.folder') {
            googFiles.push(val);
        };
    });
    var ordGoogFiles = reorderFiles(2, googFiles);

    for (const file of ordGoogFiles) {
        const fileViewer = document.createElement('div');
        files.appendChild(fileViewer);
        fileViewer.setAttribute('class', 'goog-drive-file');
        fileViewer.setAttribute('onmouseenter', 'hoverEffect(this, 1)');
        fileViewer.setAttribute('onmouseleave', 'hoverEffect(this, 1)');
        fileViewer.setAttribute('id', file.name);
        fileViewer.style.setProperty('display', 'flex', 'important');
        fileViewer.style.setProperty('flex-direction', 'column', 'important');
        fileViewer.style.setProperty('transition', 'all .2s ease-in-out', 'important')
        fileViewer.style.setProperty('background-color', secondary, 'important');
        fileViewer.style.setProperty('box-shadow', 'rgba(149, 157, 165, 0.4) 0px 0px 6px', 'important');
        fileViewer.style.setProperty('font-size', '12px', 'important');
        fileViewer.style.setProperty('margin-bottom', '20px', 'important');
        fileViewer.style.marginRight = '20px';
        fileViewer.style.height = '250px';
        fileViewer.style.width = '215px';

            const bodFlex = document.createElement('div');
            fileViewer.appendChild(bodFlex);
            bodFlex.setAttribute('class', 'bodFlex');
            bodFlex.style.setProperty('height', '80%', 'important');

                const previewImage = document.createElement('img');
                bodFlex.appendChild(previewImage);
                previewImage.setAttribute('src', file.thumbnailLink);
                previewImage.setAttribute('onclick', `openFile('${file.webViewLink}')`);
                previewImage.style.setProperty('z-index', '1', 'important');
                previewImage.style.setProperty('position', 'absolute', 'important');
                previewImage.style.setProperty('max-height', '250px', 'important');
                previewImage.style.setProperty('min-height', '200px', 'important');
                previewImage.style.width = `215px`;
                previewImage.style.cursor = 'pointer';


                const selectorDiv = document.createElement('div');
                bodFlex.appendChild(selectorDiv);
                selectorDiv.style.setProperty('z-index', '2', 'important');
                selectorDiv.style.setProperty('position', 'relative', 'important');
                selectorDiv.style.setProperty('float', 'right', 'important');
                selectorDiv.style.setProperty('margin-top', '10px', 'important');
                selectorDiv.style.setProperty('margin-right', '10px', 'important');
                selectorDiv.style.cursor = 'pointer';

                    const fileSelectorCheck = document.createElement('i');
                    selectorDiv.appendChild(fileSelectorCheck);
                    fileSelectorCheck.setAttribute('id', `${file.name}-mark`);
                    fileSelectorCheck.setAttribute('onclick', `fileToggle(this)`);
                    fileSelectorCheck.setAttribute('class', 'fa-sharp fa-solid fa-check fa-sm');
                    fileSelectorCheck.style.display = 'none';
                    fileSelectorCheck.style.setProperty('position', 'absolute', 'important');
                    fileSelectorCheck.style.setProperty('z-index', '4', 'important');
                    fileSelectorCheck.style.setProperty('margin-top', '9px', 'important');
                    fileSelectorCheck.style.setProperty('margin-left', '4px', 'important');
                    fileSelectorCheck.style.setProperty('color', '#ffffff', 'important');

                    const fileSelectorSpan = document.createElement('span');
                    selectorDiv.appendChild(fileSelectorSpan);
                    fileSelectorSpan.setAttribute('id', `${file.name}-span`);
                    fileSelectorSpan.setAttribute('onclick', `fileToggle(this)`);
                    fileSelectorSpan.style.setProperty('height', '17px', 'important');
                    fileSelectorSpan.style.setProperty('width', '17px', 'important');
                    fileSelectorSpan.style.setProperty('display', 'block', 'important');
                    fileSelectorSpan.style.backgroundColor = '#d3d3d380';
                    fileSelectorSpan.style.border = '1px solid #292929';

                    const fileSelector = document.createElement('input');
                    bodFlex.appendChild(fileSelector);
                    fileSelector.setAttribute('class', 'file-selector');
                    fileSelector.setAttribute('type', 'checkbox');
                    fileSelector.setAttribute('id', `${file.name}-input`);
                    fileSelector.setAttribute('value', file.id);
                    fileSelector.setAttribute('onchange', 'checkVis(this)');
                    fileSelector.style.setProperty('appearance', 'none', 'important');
                    fileSelector.style.setProperty('display', 'block', 'important');
            
            const footFlex = document.createElement('div');
            fileViewer.appendChild(footFlex);
            footFlex.setAttribute('class', 'footFlex');
            footFlex.style.setProperty('display', 'flex', 'important');
            footFlex.style.setProperty('justify-content', 'space-between', 'important');
            footFlex.style.setProperty('align-items', 'center', 'important');
            footFlex.style.setProperty('padding', '0px 4px 0px 10px', 'important');
            footFlex.style.setProperty('gap', '6px', 'important');
            footFlex.style.height = '20%';
            footFlex.style.zIndex = '3';
            footFlex.style.backgroundColor = '#f2f2f2';

                const nameDiv = document.createElement('div');
                footFlex.appendChild(nameDiv);
                nameDiv.setAttribute('class', 'name-div');
                nameDiv.style.setProperty('display', 'flex', 'important');
                nameDiv.style.setProperty('flex-direction', 'row', 'important');
                nameDiv.style.setProperty('justify-content', 'flex-start', 'important');
                nameDiv.style.setProperty('align-items', 'center', 'important');
                nameDiv.style.setProperty('width', '70%', 'important');

                    const PDFIconDiv = document.createElement('div');
                    nameDiv.appendChild(PDFIconDiv);
                    PDFIconDiv.setAttribute('class', 'pdf-icon');
                    PDFIconDiv.style.setProperty('marginTop', '4px', 'important');
                    PDFIconDiv.style.setProperty('margin-right', '5px', 'important');
                    PDFIconDiv.style.setProperty('width', '20px', 'important');
                    PDFIconDiv.style.color = tertiary;

                        const PDFIcon = document.createElement('i');
                        PDFIconDiv.appendChild(PDFIcon);

                        if (file.mimeType.includes('pdf')) {
                            PDFIcon.setAttribute('class', 'fa-sharp fa-solid fa-file-pdf fa-lg');

                        } else if (file.mimeType.includes('image')) {
                            PDFIcon.setAttribute('class', 'fa-sharp fa-solid fa-image fa-lg');

                        } else if (file.mimeType.includes('video')) {
                            PDFIcon.setAttribute('class', 'fa-sharp fa-solid fa-video fa-lg');

                        } else if (file.mimeType.includes('audio')) {
                            PDFIcon.setAttribute('class', 'fa-sharp fa-solid fa-music fa-lg');

                        } else {
                            PDFIcon.setAttribute('class', 'fa-sharp fa-solid fa-file fa-lg');
                        };

                    const driveFileName = document.createElement('p');
                    nameDiv.appendChild(driveFileName);
                    driveFileName.setAttribute('id', `n-${file.name}`);
                    driveFileName.setAttribute('class', 'drive-file-name');
                    driveFileName.innerText = file.name;
                    driveFileName.style.setProperty('font-size', '14px', 'important');
                    driveFileName.style.whiteSpace = 'nowrap';
                    driveFileName.style.overflow = 'hidden';
                    driveFileName.style.textOverflow = 'ellipsis';

                const iconDiv = document.createElement('div');
                footFlex.appendChild(iconDiv)
                iconDiv.setAttribute('class', 'icon-div');
                iconDiv.style.setProperty('display', 'flex', 'important');
                iconDiv.style.setProperty('flex-direction', 'row', 'important');
                iconDiv.style.setProperty('justify-content', 'center', 'important');
                iconDiv.style.setProperty('align-items', 'center', 'important');


                    const downloadFile = document.createElement('button');
                    iconDiv.appendChild(downloadFile);
                    downloadFile.setAttribute('onclick', `downloadSingle('${file.id}', '${file.name}')`);
                    downloadFile.setAttribute('class', 'gdui-desktop gdui-tablet');
                    downloadFile.style.setProperty('height', '25px', 'important');
                    downloadFile.style.setProperty('width', '25px', 'important');
                    downloadFile.style.setProperty('border', 'none', 'important');
                    downloadFile.style.setProperty('background', 'none', 'important');
                    downloadFile.style.setProperty('color', iconColor, 'important');
                    downloadFile.style.setProperty('align-items', 'center', 'important');
                    downloadFile.style.cursor = 'pointer';
                    downloadFile.style.display = 'flex';

                        const downloadFileIcon = document.createElement('i');
                        downloadFile.appendChild(downloadFileIcon);
                        downloadFileIcon.setAttribute('class', 'fa-sharp fa-solid fa-download');
                        downloadFileIcon.setAttribute('onmouseenter', `icoHovEffect(this, 1)`);
                        downloadFileIcon.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);

                    const printFile = document.createElement('button');
                    iconDiv.appendChild(printFile);
                    printFile.setAttribute('onclick', `openFile('${file.webViewLink}')`);
                    printFile.setAttribute('class', 'gdui-desktop gdui-tablet');
                    printFile.style.setProperty('height', '25px', 'important');
                    printFile.style.setProperty('width', '25px', 'important');
                    printFile.style.setProperty('border', 'none', 'important');
                    printFile.style.setProperty('background', 'none', 'important');
                    printFile.style.setProperty('color', iconColor, 'important');
                    printFile.style.setProperty('align-items', 'center', 'important');
                    printFile.style.cursor = 'pointer';
                    printFile.style.display = 'flex';

                        const printFileIcon = document.createElement('i');
                        printFile.appendChild(printFileIcon);
                        printFileIcon.setAttribute('class', 'fa-sharp fa-solid fa-print');
                        printFileIcon.setAttribute('onmouseenter', `icoHovEffect(this, 1)`);
                        printFileIcon.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);

                    const selDivText = document.createElement('div');
                    iconDiv.appendChild(selDivText);
                    selDivText.setAttribute('class', 'selDivText');
                    selDivText.style.setProperty('z-index', '2', 'important');
                    selDivText.style.setProperty('position', 'relative', 'important');
                    selDivText.style.setProperty('float', 'right', 'important');
                    selDivText.style.setProperty('color', 'black', 'important');
                    selDivText.style.cursor = 'pointer';
                    selDivText.style.display = 'none';

                        const fileSelChkText = document.createElement('i');
                        selDivText.appendChild(fileSelChkText);
                        fileSelChkText.setAttribute('id', `t-${file.name}-mark`);
                        fileSelChkText.setAttribute('onclick', `fileToggle(this)`);
                        fileSelChkText.setAttribute('class', 'fa-sharp fa-solid fa-check fa-sm');
                        fileSelChkText.style.setProperty('position', 'absolute', 'important');
                        fileSelChkText.style.setProperty('z-index', '4', 'important');
                        fileSelChkText.style.setProperty('margin-top', '9px', 'important');
                        fileSelChkText.style.setProperty('margin-left', '5px', 'important');
                        fileSelChkText.style.display = 'none';

                        const fileSelSpText = document.createElement('span');
                        selDivText.appendChild(fileSelSpText);
                        fileSelSpText.setAttribute('id', `t-${file.name}-span`);
                        fileSelSpText.setAttribute('onclick', `fileToggle(this)`);
                        fileSelSpText.style.setProperty('height', '17px', 'important');
                        fileSelSpText.style.setProperty('width', '17px', 'important');
                        fileSelSpText.style.backgroundColor = '#d3d3d380';
                        fileSelSpText.style.display = 'block';
                        fileSelSpText.style.border = '1px solid #292929';

                        const fileSelText = document.createElement('input');
                        iconDiv.appendChild(fileSelText);
                        fileSelText.setAttribute('class', 't-file-selector');
                        fileSelText.setAttribute('type', 'checkbox');
                        fileSelText.setAttribute('id', `t-${file.name}-input`);
                        fileSelText.setAttribute('value', file.id);
                        fileSelText.setAttribute('onchange', 'checkVis(this)');
                        fileSelText.style.setProperty('display', 'none', 'important');
        
                    const dropDiv = document.createElement('div');
                    iconDiv.appendChild(dropDiv);
                    dropDiv.setAttribute('class', 'gdui-mobile drop-element');
                    dropDiv.style.display = 'none';

                        const dropdown = document.createElement('button');
                        dropDiv.appendChild(dropdown);
                        dropdown.setAttribute('class', 'drop-element');
                        dropdown.setAttribute('onclick', `dropClick('${file.name}')`);
                        dropdown.style.setProperty('height', '25px', 'important');
                        dropdown.style.setProperty('width', '25px', 'important');
                        dropdown.style.setProperty('border', 'none', 'important');
                        dropdown.style.setProperty('background', 'none', 'important');
                        dropdown.style.setProperty('color', iconColor, 'important');
                        dropdown.style.cursor = 'pointer';
        
                            const dropdownIcon = document.createElement('i');
                            dropdown.appendChild(dropdownIcon);
                            dropdownIcon.setAttribute('class', 'fa-solid fa-ellipsis-vertical fa-xl drop-element');
                            dropdownIcon.setAttribute('onmouseenter', `icoHovEffect(this, 1)`);
                            dropdownIcon.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);
    
                        const fileDropMenu = document.createElement('div');
                        dropDiv.appendChild(fileDropMenu);
                        fileDropMenu.setAttribute('id', `${file.name}-dropmenu`);
                        fileDropMenu.setAttribute('class', 'dropmenu drop-element');
                        fileDropMenu.style.display = 'none';
                        fileDropMenu.style.setProperty('flex-direction', 'column', 'important');
                        fileDropMenu.style.setProperty('position', 'absolute', 'important');
                        fileDropMenu.style.setProperty('margin-top', '25px', 'important');
                        fileDropMenu.style.setProperty('width', '40px', 'important');
                        fileDropMenu.style.setProperty('background-color', secondary, 'important');
                        fileDropMenu.style.setProperty('z-index', '5', 'important');

                            const dropDownload = document.createElement('button');
                            fileDropMenu.appendChild(dropDownload);
                            dropDownload.setAttribute('class', 'drop-element');
                            dropDownload.setAttribute('onclick', `downloadSingle('${file.id}', '${file.name}')`);
                            dropDownload.style.setProperty('height', '25px', 'important');
                            dropDownload.style.setProperty('width', '25px', 'important');
                            dropDownload.style.setProperty('border', 'none', 'important');
                            dropDownload.style.setProperty('background', 'none', 'important');
                            dropDownload.style.setProperty('color', iconColor, 'important');
                            dropDownload.style.setProperty('margin', '5px', 'important');
                            dropDownload.style.cursor = 'pointer';

                                const dropDownloadIcon = document.createElement('i');
                                dropDownload.appendChild(dropDownloadIcon);
                                dropDownloadIcon.setAttribute('class', 'fa-sharp fa-solid fa-download fa-xl drop-element');
                                dropDownloadIcon.setAttribute('onmouseenter', `icoHovEffect(this, 1)`);
                                dropDownloadIcon.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);
        
                            const dropPrint = document.createElement('button');
                            fileDropMenu.appendChild(dropPrint);
                            dropPrint.setAttribute('id', `${file.name}-print`);
                            dropPrint.setAttribute('class', 'drop-element');
                            dropPrint.setAttribute('onclick', `openFile(${file.webViewLink})`);
                            dropPrint.style.setProperty('height', '25px', 'important');
                            dropPrint.style.setProperty('width', '25px', 'important');
                            dropPrint.style.setProperty('border', 'none', 'important');
                            dropPrint.style.setProperty('background', 'none', 'important');
                            dropPrint.style.setProperty('color', iconColor, 'important');
                            dropPrint.style.setProperty('margin', '5px', 'important');
                            dropPrint.style.cursor = 'pointer';
            
                                const dropPrintIcon = document.createElement('i');
                                dropPrint.appendChild(dropPrintIcon);
                                dropPrintIcon.setAttribute('class', 'fa-sharp fa-solid fa-print fa-xl drop-element');
                                dropPrintIcon.setAttribute('onmouseenter', `icoHovEffect(this, 1)`);
                                dropPrintIcon.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);
            };
};
async function GetDriveInfo(desFolder, num) {
    const url = 'https://www.googleapis.com/drive/v3/files?q="' + desFolder + '"+in+parents&key=' + 
                googDiv.dataset.apikey + '&fields=files(id, name, mimeType, thumbnailLink, webViewLink)';
    try {
        xhr = new XMLHttpRequest();
        xhr.open("GET", url);
        xhr.onload = function() {
            //use switch statements to sort through responses if GetDriveInfo() is used in multiple places
            const jsonResponse = JSON.parse(xhr.responseText);
                switch (num) {
                case 1: 
                    setFolders(jsonResponse);
                    setFiles(jsonResponse);
                    cssChange();
                    if (textIcons) {
                        explorerView();
                    };
                    break;
                case 2: 
                    setFiles(jsonResponse);
                    cssChange();
                    if (textIcons) {
                        explorerView();
                    };
                    break;
                default:
                    console.error('Failed to get data.');
            }
        };
        await xhr.send(null);
    } catch (error) {
        console.error('Failed to get files with error: ', error);
    };

    return 'done';
};

//CSS for computer screen
function ComputerCSS(desktopDivs, tabletDivs, mobileDivs, folderButtons, fileCard, pathing, footFlex, driveFileName) {
    
    tabletDivs.forEach((val) => {
        val.style.display = 'none';
    });
    mobileDivs.forEach((val) => {
        val.style.display = 'none';
    });    
    desktopDivs.forEach((val) => {
        val.style.display = 'flex';
    });

    googDiv.style.marginLeft = '10%';
    googDiv.style.marginRight = '10%';

    //UIHeader
    pathing.forEach((path) => {
        path.style.display = 'none';
    });

    //UIBody
    folderButtons.forEach((folder) => {
        folder.style.width = '215px';
    });
    fileCard.forEach ((file) => {
        if (!textIcons) {
            const fileImage = file.getElementsByTagName('img');
            file.style.width = '215px';
            file.style.marginRight = '20px';
            fileImage[0].style.width = '215px';
        };
    });
    footFlex.forEach((footer) => {
        if (!textIcons) {
            footer.style.height = '20%';
        } else {
            footer.style.height = '100%';
        }    });
    driveFileName.forEach((fileName) => {
        fileName.style.whiteSpace = 'nowrap';
        fileName.style.overflow = 'hidden';
        fileName.style.textOverflow = 'ellipsis';
        fileName.style.height = '';
        fileName.style.display = '';
        fileName.style.alignItems = '';
        fileName.style.wordBreak = '';
        fileName.innerText = `${fileName.id.substring(2)}`;
    });

    input.style.height = '25px';
        magButton.style.paddingBottom = '15px';
            magGlassIcon.setAttribute('class', 'fa-sharp fa-solid fa-magnifying-glass fa-lg');

    refreshIcon.setAttribute('class', 'fa-sharp fa-solid fa-rotate fa-lg');


    //UIFooter
    UIFooter.style.justifyContent = 'flex-end';
    UIFooter.style.paddingRight = '0px';

        downloadButton.style.width = '200px';
};
//CSS for tablet screen
function TabletCSS(desktopDivs, tabletDivs, mobileDivs, folderButtons, fileCard, pathing, footFlex, driveFileName) {

    desktopDivs.forEach((val) => {
        val.style.display = 'none'
    });
    mobileDivs.forEach((val) => {
        val.style.display = 'none'
    });
    tabletDivs.forEach((val) => {
        val.style.display = 'flex';
    });


    googDiv.style.marginLeft = '5%';
    googDiv.style.marginRight = '5%';

    //UIHeader
    pathing[pathing.length - 1].style.display = 'block'

    //UIBody
    folderButtons.forEach((folder) => {
        folder.style.width = '215px';
    });
    fileCard.forEach ((file) => {
        if (!textIcons) {
            const fileImage = file.getElementsByTagName('img');
            file.style.width = '215px';
            file.style.marginRight = '20px';
            fileImage[0].style.width = '215px';
        };
    });
    footFlex.forEach((footer) => {
        if (!textIcons) {
            footer.style.height = '20%';
        } else {
            footer.style.height = '100%';
        }    });
    driveFileName.forEach((fileName) => {
        fileName.style.whiteSpace = 'nowrap';
        fileName.style.overflow = 'hidden';
        fileName.style.textOverflow = 'ellipsis';
        fileName.style.height = '';
        fileName.style.display = '';
        fileName.style.alignItems = '';
        fileName.style.wordBreak = '';
        fileName.innerText = `${fileName.id.substring(2)}`;
    });

    input.style.height = '35px';
        magButton.style.paddingBottom = '7px';
            magGlassIcon.setAttribute('class', 'fa-sharp fa-solid fa-magnifying-glass fa-2xl');
    
    refreshIcon.setAttribute('class', 'fa-sharp fa-solid fa-rotate fa-2xl');


    //UIFooter
    UIFooter.style.justifyContent = 'flex-end';
    UIFooter.style.paddingRight = '35px';

        downloadButton.style.width = '200px';
};
//CSS for Phone Screen
function PhoneCSS(desktopDivs, tabletDivs, mobileDivs, folderButtons, fileCard, pathing, footFlex, driveFileName) {

    desktopDivs.forEach((val) => {
        val.style.display = 'none';
    });
    tabletDivs.forEach((val) => {
        val.style.display = 'none';
    });
    mobileDivs.forEach((val) => {
        val.style.display = 'flex';
    });

    googDiv.style.marginLeft = '1%';
    googDiv.style.marginRight = '1%';

    //UIHeader
    pathing[pathing.length - 1].style.display = 'block'


    //UIBody
    folderButtons.forEach((folder) => {
        folder.style.width = '46%';
    });
    fileCard.forEach ((file) => {
        if(!textIcons) {
            const fileImage = file.getElementsByTagName('img');
            file.style.width = '46%';
            file.style.marginRight = '15px';
            fileImage[0].style.width = `${(files.offsetWidth * 0.46)}px`;
        };
    });
    footFlex.forEach((footer) => {
        if (!textIcons) {
            footer.style.height = '35%';
        } else {
            footer.style.height = '100%';
        }
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
            fileName.innerText = `${fileName.id.substring(2, 20) + '...'}`;
        }
    });

    input.style.height = '35px';
        magButton.style.paddingBottom = '7px';
            magGlassIcon.setAttribute('class', 'fa-sharp fa-solid fa-magnifying-glass fa-2xl');
    
    refreshIcon.setAttribute('class', 'fa-sharp fa-solid fa-rotate fa-2xl');


    //UIFooter
    UIFooter.style.justifyContent = 'center';
    UIFooter.style.paddingRight = '0px';

        downloadButton.style.width = '95%';
};


//apply CSS to googleDrive div
googDiv.style.setProperty('display', 'flex', 'important');
googDiv.style.setProperty('flex-direction', 'column', 'important');
googDiv.style.outline = true;
googDiv.style.setProperty('background-color', primary, 'important');
googDiv.style.setProperty('margin-bottom', '10px', 'important');
googDiv.style.color = 'black';
googDiv.style.fontFamily = fontStyle;


//UI header
const uiHeader = document.createElement('div');
googDiv.appendChild(uiHeader);
uiHeader.setAttribute('id', 'ui-header');
uiHeader.style.setProperty('display', 'flex', 'important');
uiHeader.style.setProperty('alignItems', 'center', 'important');
uiHeader.style.setProperty('margin-top', '10px', 'important');
uiHeader.style.setProperty('margin-bottom', '10px', 'important');
uiHeader.style.setProperty('padding-left', '5px', 'important');
uiHeader.style.setProperty('padding-right', '0px', 'important');

    const filepath = document.createElement('div');
    uiHeader.appendChild(filepath);
    filepath.setAttribute('id', 'filepath');
    filepath.style.display = 'flex';
    filepath.style.setProperty('flex-direction', 'row', 'important');
    filepath.style.setProperty('align-items', 'center', 'important');
    filepath.style.width = '40%';
    filepath.style.setProperty('height', '50px', 'important');
    filepath.style.setProperty('font-size', '14px', 'important');
    
        const backBtn = document.createElement('button');
        filepath.appendChild(backBtn);
        backBtn.setAttribute('onclick', `folderBack()`);
        backBtn.setAttribute('onmouseenter', `icoHovEffect(this, 1)`);
        backBtn.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);
        backBtn.setAttribute('class', 'gdui-mobile gdui-tablet');
        backBtn.style.setProperty('background', 'none', 'important');
        backBtn.style.setProperty('border', 'none', 'important');
        backBtn.style.color = 'black';

            const backIcon = document.createElement('i');
            backBtn.appendChild(backIcon);
            backIcon.setAttribute('class', 'fa-sharp fa-solid fa-arrow-left fa-2xl');


        const homePath = document.createElement('p');
        filepath.appendChild(homePath);
        homePath.setAttribute('id', '0');
        homePath.setAttribute('class', 'folder gdui-desktop');
        homePath.setAttribute('onclick', `folderChange('${googDiv.dataset.folder}', 1, this.id, this.innerText)`);
        homePath.innerText = 'Home ';
        homePath.style.setProperty('whiteSpace', 'pre', 'important');
        homePath.style.setProperty('font-size', '14px', 'important');
        homePath.style.cursor = 'pointer';
        homePath.style.fontWeight = '700';
        homePath.style.color = tertiary;
        
        const mobileHome = document.createElement('p');
        filepath.appendChild(mobileHome);
        mobileHome.setAttribute('class', 'mobile-folder');
        mobileHome.innerText = 'Home';
        mobileHome.style.setProperty('font-size', '14px', 'important');
        mobileHome.style.display = 'none';
        mobileHome.style.color = tertiary;
        mobileHome.style.fontWeight = '700';


    const fileSearch = document.createElement('div')
    uiHeader.appendChild(fileSearch);
    fileSearch.setAttribute('id', 'file-search');
    fileSearch.style.setProperty('display', 'flex', 'important');
    fileSearch.style.setProperty('flex-direction', 'row', 'important');
    fileSearch.style.justifyContent = 'flex-end';
    fileSearch.style.setProperty('align-items', 'center', 'important');
    fileSearch.style.setProperty('margin-right', '5px', 'important');
    fileSearch.style.width = '60%';
    fileSearch.style.setProperty('height', '50px', 'important');

        const searchDiv = document.createElement('div');
        fileSearch.appendChild(searchDiv);

            const input = document.createElement('div');
            searchDiv.appendChild(input);
            input.setAttribute('id', 'input');
            input.style.backgroundColor = secondary;
            input.style.setProperty('background-color', secondary, 'important');
            input.style.setProperty('display', 'flex', 'important');
            input.style.setProperty('align', '', 'important');
            input.style.setProperty('padding', '4px', 'important');

                const magButton = document.createElement('button');
                input.appendChild(magButton);
                magButton.setAttribute('onclick', 'searchActivate()');
                magButton.style.setProperty('background', 'none', 'important');
                magButton.style.setProperty('border', 'none', 'important');
                magButton.style.color = iconColor;
                magButton.style.setProperty('height', '2.5em', 'important');
                magButton.style.setProperty('font', 'revert', 'important');

                    const magGlassIcon = document.createElement('i');
                    magButton.appendChild(magGlassIcon);
                    magGlassIcon.setAttribute('id', 'mag-ico');
                    magGlassIcon.setAttribute('class', 'fa-sharp fa-solid fa-magnifying-glass fa-lg');
                    magGlassIcon.setAttribute('onmouseenter', `icoHovEffect(this, 1)`);
                    magGlassIcon.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);

                const inputBox = document.createElement('input');
                input.appendChild(inputBox);
                inputBox.setAttribute('id', 'input-box');
                inputBox.setAttribute('class', 'gdui-desktop gdui-tablet');
                inputBox.setAttribute('type', 'text');
                inputBox.setAttribute('onkeyup', 'searchFiles(this.value)');
                inputBox.setAttribute('placeholder', 'Search Filenames');
                inputBox.style.setProperty('border', 'none', 'important');
                inputBox.style.setProperty('outline', 'none', 'important');
                inputBox.style.setProperty('background', 'transparent', 'important');
                inputBox.style.setProperty('font', 'revert', 'important');
                inputBox.style.color = iconColor;

        const iconsDiv = document.createElement('div');
        fileSearch.appendChild(iconsDiv);
        iconsDiv.style.setProperty('display', 'flex', 'important');
        iconsDiv.style.setProperty('justify-content', 'flex-end', 'important');
        iconsDiv.style.setProperty('align-items', 'center', 'important');

            const fileOrder = document.createElement('button');
            iconsDiv.appendChild(fileOrder);
            fileOrder.setAttribute('id', 'file-order');
            fileOrder.setAttribute('onclick', 'reorderFiles(1)');
            fileOrder.setAttribute('class', 'gdui-desktop')
            fileOrder.style.setProperty('margin-right', '3px', 'important');
            fileOrder.style.setProperty('margin-left', '5px', 'important');
            fileOrder.style.setProperty('border', 'none', 'important');
            fileOrder.style.setProperty('background', 'none', 'important');
            fileOrder.style.setProperty('font', 'revert', 'important');
            fileOrder.style.color = iconColor;
            fileOrder.style.cursor = 'pointer';

                const fileOrderIcon = document.createElement('i');
                fileOrder.appendChild(fileOrderIcon);
                fileOrderIcon.setAttribute('class', 'fa-sharp fa-solid fa-arrow-down-wide-short fa-lg');
                fileOrderIcon.setAttribute('onmouseenter', `icoHovEffect(this, 1)`);
                fileOrderIcon.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);

            const appearance = document.createElement('button');
            iconsDiv.appendChild(appearance);
            appearance.setAttribute('id', 'appearance');
            appearance.setAttribute('onclick', 'explorerView(1)');
            appearance.setAttribute('class', 'gdui-desktop')
            appearance.style.setProperty('margin-right', '3px', 'important');
            appearance.style.setProperty('border', 'none', 'important');
            appearance.style.setProperty('background', '3px', 'important');
            appearance.style.setProperty('font', 'revert', 'important');
            appearance.style.color = iconColor;
            appearance.style.cursor = 'pointer';

                const appearanceIcon = document.createElement('i');
                appearance.appendChild(appearanceIcon);
                appearanceIcon.setAttribute('class', 'fa-solid fa-list fa-lg');
                appearanceIcon.setAttribute('onmouseenter', `icoHovEffect(this, 1)`);
                appearanceIcon.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);

            const dropDiv = document.createElement('div');
            iconsDiv.appendChild(dropDiv);
            dropDiv.setAttribute('class', 'gdui-mobile gdui-tablet drop-element');
            dropDiv.style.display = '';

                const dropdown = document.createElement('button');
                dropDiv.appendChild(dropdown);
                dropdown.setAttribute('onclick', `dropClick('header')`);
                dropdown.setAttribute('class', `drop-element`);
                dropdown.style.setProperty('height', '25px', 'important');
                dropdown.style.setProperty('width', '25px', 'important');
                dropdown.style.setProperty('margin-right', '15px', 'important');
                dropdown.style.setProperty('margin-left', '15px', 'important');
                dropdown.style.setProperty('border', 'none', 'important');
                dropdown.style.setProperty('background', 'none', 'important');
                dropdown.style.setProperty('font', 'revert', 'important');
                dropdown.style.color = iconColor;
                dropdown.style.cursor = 'pointer';

                    const dropdownIcon = document.createElement('i');
                    dropdown.appendChild(dropdownIcon);
                    dropdownIcon.setAttribute('class', 'fa-solid fa-ellipsis-vertical fa-2xl drop-element');
                    dropdownIcon.setAttribute('onmouseenter', `icoHovEffect(this, 1)`);
                    dropdownIcon.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);

                const dropMenu = document.createElement('div');
                dropDiv.appendChild(dropMenu);
                dropMenu.setAttribute('id', `header-dropmenu`);
                dropMenu.setAttribute('class', 'dropmenu drop-element');
                dropMenu.style.display = 'none';
                dropMenu.style.setProperty('flex-direction', 'column', 'important');
                dropMenu.style.setProperty('position', 'absolute', 'important');
                dropMenu.style.setProperty('margin-top', '25px', 'important');
                dropMenu.style.setProperty('background-color', secondary, 'important');
                dropMenu.style.setProperty('z-index', '5', 'important');

                    const fileOrderDrop = document.createElement('button');
                    dropMenu.appendChild(fileOrderDrop);
                    fileOrderDrop.setAttribute('id', 'file-order');
                    fileOrderDrop.setAttribute('id', `drop-element`);
                    fileOrderDrop.setAttribute('onclick', 'reorderFiles(1)');
                    fileOrderDrop.style.setProperty('margin', '10px', 'important');
                    fileOrderDrop.style.setProperty('border', 'none', 'important');
                    fileOrderDrop.style.setProperty('background', 'none', 'important');
                    fileOrderDrop.style.color = iconColor;
                    fileOrderDrop.style.setProperty('font', 'revert', 'important');
                    fileOrderDrop.style.cursor = 'pointer';
            
                        const fileOrderIconDrop = document.createElement('i');
                        fileOrderDrop.appendChild(fileOrderIconDrop);
                        fileOrderIconDrop.setAttribute('class', 'fa-sharp fa-solid fa-arrow-down-wide-short fa-2xl drop-element');
                        fileOrderIconDrop.setAttribute('onmouseenter', `icoHovEffect(this, 1)`);
                        fileOrderIconDrop.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);
            
                    const appearanceDrop = document.createElement('button');
                    dropMenu.appendChild(appearanceDrop);
                    appearanceDrop.setAttribute('id', 'appearance');
                    appearanceDrop.setAttribute('class', 'drop-element')
                    appearanceDrop.setAttribute('onclick', 'explorerView(1)');
                    appearanceDrop.style.setProperty('margin', '10px', 'important');
                    appearanceDrop.style.setProperty('border', 'none', 'important');
                    appearanceDrop.style.setProperty('background', 'none', 'important');
                    appearanceDrop.style.setProperty('font', 'revert', 'important');
                    appearanceDrop.style.color = iconColor;
                    appearanceDrop.style.cursor = 'pointer';
            
                        const appearanceIconDrop = document.createElement('i');
                        appearanceDrop.appendChild(appearanceIconDrop);
                        appearanceIconDrop.setAttribute('class', 'fa-solid fa-list fa-2xl drop-element');
                        appearanceIconDrop.setAttribute('onmouseenter', `icoHovEffect(this, 1)`);
                        appearanceIconDrop.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);

                    const selectDivDrop = document.createElement('button');
                    dropMenu.appendChild(selectDivDrop);
                    selectDivDrop.setAttribute('class', 'drop-element');
                    selectDivDrop.setAttribute('onclick', `selectFiles('d-select-all-input', 1)`)
                    selectDivDrop.style.display = 'flex';
                    selectDivDrop.style.justifyContent = 'center';
                    selectDivDrop.style.backgroundColor = secondary;
                    selectDivDrop.style.setProperty('padding-left', '8px', 'important');
                    selectDivDrop.style.setProperty('margin', '10px', 'important');
                    selectDivDrop.style.setProperty('border', 'none', 'important');
                    selectDivDrop.style.setProperty('font', 'revert', 'important');
                    selectDivDrop.style.color = 'black';
                    selectDivDrop.style.cursor = 'pointer';
            
                        const checkmarkDrop = document.createElement('i');
                        selectDivDrop.appendChild(checkmarkDrop);
                        checkmarkDrop.setAttribute('id', 'd-select-all-mark');
                        checkmarkDrop.setAttribute('class', 'fa-sharp fa-solid fa-check fa-sm drop-element');
                        checkmarkDrop.style.display = 'none';
                        checkmarkDrop.style.setProperty('position', 'absolute', 'important');
                        checkmarkDrop.style.setProperty('z-index', '2', 'important');
                        checkmarkDrop.style.setProperty('margin-top', '13px', 'important');
                        // checkmarkDrop.style.setProperty('margin-left', '-6px', 'important');
                        checkmarkDrop.style.setProperty('color', '#171717', 'important');
            
                        const selectSpanDrop = document.createElement('span');
                        selectDivDrop.appendChild(selectSpanDrop);
                        selectSpanDrop.setAttribute('id', 'd-select-all-span');
                        selectSpanDrop.setAttribute('class', 'drop-element')
                        selectSpanDrop.style.setProperty('height', '25px', 'important');
                        selectSpanDrop.style.setProperty('width', '25px', 'important');
                        selectSpanDrop.style.backgroundColor = '#d3d3d380';
                        selectSpanDrop.style.border = '1px solid #292929';
                        selectSpanDrop.style.setProperty('display', 'block', 'important');
                        selectSpanDrop.style.setProperty('z-index', '1', 'important');
            
                        const selectAllDrop = document.createElement('input');
                        selectDivDrop.appendChild(selectAllDrop);
                        selectAllDrop.setAttribute('id', 'd-select-all-input');
                        selectAllDrop.setAttribute('class', 'drop-element');
                        selectAllDrop.setAttribute('type', 'checkbox');
                        selectAllDrop.setAttribute('onchange', 'checkVis(this)');
                        selectAllDrop.style.setProperty('appearance', 'none', 'important');

                const refresh = document.createElement('button');
                iconsDiv.appendChild(refresh);
                refresh.setAttribute('id', 'refresh');
                refresh.setAttribute('onclick', 'refreshFiles()');
                refresh.style.setProperty('margin-right', '3px', 'important');
                refresh.style.setProperty('border', 'none', 'important');
                refresh.style.setProperty('background', 'none', 'important');
                refresh.style.color = iconColor;
                refresh.style.cursor = 'pointer';
                refresh.style.setProperty('height', '2.5em', 'important');
                refresh.style.setProperty('font', 'revert', 'important');
                refresh.style.transform = 'rotate(0deg)';

                    const refreshIcon = document.createElement('i');
                    refresh.appendChild(refreshIcon);
                    refreshIcon.setAttribute('class', 'fa-sharp fa-solid fa-rotate fa-lg');
                    refreshIcon.setAttribute('onmouseenter', `icoHovEffect(this, 1, true)`);
                    refreshIcon.setAttribute('onmouseleave', `icoHovEffect(this, 2)`);

            const selectDiv = document.createElement('button');
            iconsDiv.appendChild(selectDiv);
            selectDiv.setAttribute('onclick', `selectFiles('select-all-input', 1)`);
            selectDiv.setAttribute('onmouseenter', `icoHovEffect(this, 1, false, true)`);
            selectDiv.setAttribute('onmouseleave', `icoHovEffect(this, 2, false, true)`);
            selectDiv.setAttribute('class', 'gdui-desktop');
            selectDiv.style.display = 'flex';
            selectDiv.style.cursor = 'pointer';
            selectDiv.style.setProperty('align-items', 'center', 'important');
            selectDiv.style.setProperty('background-color', secondary, 'important');
            selectDiv.style.setProperty('padding-right', '8px', 'important');
            selectDiv.style.setProperty('padding-left', '8px', 'important');
            // selectDiv.style.setProperty('color', 'black', 'important');
            selectDiv.style.setProperty('height', '35px', 'important');
            selectDiv.style.setProperty('border', 'none', 'important');
            selectDiv.style.setProperty('font', 'revert', 'important');

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
                selectAll.setAttribute('onchange', 'checkVis(this)');
                selectAll.style.setProperty('appearance', 'none', 'important');

                const selectLabel = document.createElement('label');
                selectDiv.appendChild(selectLabel);
                selectLabel.setAttribute('id', 'select-all-label');
                selectLabel.setAttribute('for', 'select-all');
                selectLabel.style.color = 'white';
                selectLabel.innerText = 'Select All';
                selectLabel.style.cursor = 'pointer';
                selectLabel.style.setProperty('font-size', '14px', 'important');
                selectLabel.style.setProperty('margin-bottom', '0px', 'important');
                selectLabel.style.setProperty('margin-left', '5px', 'important');

    const headerSep = document.createElement('hr');
    googDiv.appendChild(headerSep);
    headerSep.style.setProperty('border-color', secondary, 'important');
    headerSep.style.setProperty('width', '100%', 'important');


//UI file selector
const UIFileSelector = document.createElement('div');
googDiv.appendChild(UIFileSelector);
UIFileSelector.setAttribute('id', 'ui-file-selector');
UIFileSelector.style.setProperty('padding-left', '5px', 'important');
UIFileSelector.style.setProperty('padding-right', '5px', 'important');
UIFileSelector.style.setProperty('margin-top', '20px', 'important');
UIFileSelector.style.setProperty('margin-bottom', '20px', 'important');

    const folders = document.createElement('div');
    UIFileSelector.appendChild(folders);
    folders.style.setProperty('display', 'flex', 'important');
    folders.style.setProperty('flex-direction', 'row', 'important');
    folders.style.setProperty('flex-wrap', 'wrap', 'important');
    folders.style.setProperty('margin-bottom', '20px', 'important');


    const files = document.createElement('div');
    UIFileSelector.appendChild(files);
    files.setAttribute('id', 'file-div');
    files.style.setProperty('display', 'flex', 'important');
    files.style.setProperty('flex-direction', 'row', 'important');
    files.style.setProperty('flex-wrap', 'wrap', 'important');

//UI footer

const footerSep = document.createElement('hr');
googDiv.appendChild(footerSep);
footerSep.style.setProperty('border-color', '#171717', 'important');
footerSep.style.setProperty('width', '100%', 'important');

const UIFooter = document.createElement('div');
googDiv.appendChild(UIFooter);
UIFooter.setAttribute('id', 'ui-footer');
UIFooter.style.setProperty('background-color', primary, 'important');
UIFooter.style.setProperty('display', 'flex', 'important');
UIFooter.style.setProperty('padding-top', '10px', 'important');
UIFooter.style.setProperty('padding-bottom', '10px', 'important');
UIFooter.style.setProperty('padding-right', '0px', 'important');

    const downloadButton = document.createElement('button');
    UIFooter.appendChild(downloadButton);
    downloadButton.setAttribute('id', 'download-button');
    downloadButton.setAttribute('onclick', 'downloadMulti()');
    downloadButton.setAttribute('onmouseenter', 'downHov(1)');
    downloadButton.setAttribute('onmouseleave', 'downHov(2)');
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

        const downloadText = document.createElement('p');
        downloadButton.appendChild(downloadText);
        downloadText.innerHTML = 'DOWNLOAD';
        downloadText.style.setProperty('font-size', '14px', 'important');
        downloadText.style.setProperty('font-weight', '700', 'important');

        const downloadImg = document.createElement('i');
        downloadButton.appendChild(downloadImg);
        downloadImg.setAttribute('class', 'fa-sharp fa-solid fa-download');
        downloadImg.style.setProperty('margin-left', '10px', 'important');



function cssChange() {
    const desktopDivs = Array.prototype.slice.call(document.getElementsByClassName('gdui-desktop'));
    const tabletDivs = Array.prototype.slice.call(document.getElementsByClassName('gdui-tablet'));
    const mobileDivs = Array.prototype.slice.call(document.getElementsByClassName('gdui-mobile'));
    const folderButtons = Array.prototype.slice.call(folders.getElementsByClassName('goog-folder'));
    const fileCard = Array.prototype.slice.call(files.getElementsByClassName('goog-drive-file'));
    const pathing = Array.prototype.slice.call(filepath.getElementsByClassName('mobile-folder'));
    const footFlex = Array.prototype.slice.call(files.getElementsByClassName('footFlex'));
    const driveFileName = Array.prototype.slice.call(files.getElementsByClassName('drive-file-name'));


    if (window.innerWidth >= 768 && window.innerWidth < 1024) {
        TabletCSS(desktopDivs, tabletDivs, mobileDivs, folderButtons, fileCard, pathing, footFlex, driveFileName);
    } else if (window.innerWidth < 768) {
        PhoneCSS(desktopDivs, tabletDivs, mobileDivs, folderButtons, fileCard, pathing, footFlex, driveFileName);
    } else {
        ComputerCSS(desktopDivs, tabletDivs, mobileDivs, folderButtons, fileCard, pathing, footFlex, driveFileName);
    };
};
cssChange();
GetDriveInfo(arrayPath[0], 1);

//Event Listeners
var resizeStop = null;
function resizeChecker() {
    clearTimeout(resizeStop);
    resizeStop = setTimeout(cssChange, 100);
};
window.addEventListener('resize', resizeChecker);
