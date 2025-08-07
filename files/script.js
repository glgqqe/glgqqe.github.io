const BASE_PATH = './storage/';
const fileListDiv = document.getElementById('file-list');

async function listFiles(path = '') {
  const url = BASE_PATH + path;
  const response = await fetch(url);
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const links = [...doc.querySelectorAll('a')];
  fileListDiv.innerHTML = `<h2>${path || '/'}</h2><ul>`;

  for (const link of links) {
    const name = link.getAttribute('href');
    if (name === '../') continue;

    const fullPath = path + name;

    if (name.endsWith('/')) {
      fileListDiv.innerHTML += `
        <li>📁 <a href="?path=${fullPath}">${name}</a>
        <button onclick="downloadZip('${fullPath}')">ZIP</button></li>`;
    } else {
      fileListDiv.innerHTML += `
        <li>📄 <a href="${BASE_PATH + fullPath}" download>${name}</a></li>`;
    }
  }

  fileListDiv.innerHTML += '</ul>';
}

async function downloadZip(path) {
  const zip = new JSZip();
  await addFilesToZip(zip.folder(path), path);
  const content = await zip.generateAsync({ type: 'blob' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(content);
  a.download = path.replace(/\/$/, '') + '.zip';
  a.click();
}

async function addFilesToZip(folder, path) {
  const url = BASE_PATH + path;
  const response = await fetch(url);
  const html = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  const links = [...doc.querySelectorAll('a')];
  for (const link of links) {
    const name = link.getAttribute('href');
    if (name === '../') continue;

    const fullPath = path + name;

    if (name.endsWith('/')) {
      await addFilesToZip(folder.folder(name), fullPath);
    } else {
      const fileUrl = BASE_PATH + fullPath;
      const fileResp = await fetch(fileUrl);
      const blob = await fileResp.blob();
      folder.file(name, blob);
    }
  }
}

const params = new URLSearchParams(location.search);
const currentPath = params.get('path') || '';
listFiles(currentPath);
