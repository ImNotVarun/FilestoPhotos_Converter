document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('files');
    const fileCount = document.getElementById('fileCount');
    const existingImageInput = document.getElementById('existing_image');
    const imageCount = document.getElementById('imageCount');
    const extractImageInput = document.getElementById('image');
    const extractImageCount = document.getElementById('extractImageCount');
    const loadingBar = document.getElementById('loadingBar');
    const loadingProgress = document.getElementById('loadingProgress');

    function updateFileCount(input, countElement, labelElement) {
        const fileCount = input.files.length;
        countElement.textContent = fileCount > 0 ? `${fileCount} file${fileCount > 1 ? 's' : ''} selected` : '';
        labelElement.classList.toggle('file-selected', fileCount > 0);
    }

    fileInput.addEventListener('change', () => updateFileCount(fileInput, fileCount, fileInput.previousElementSibling));
    existingImageInput.addEventListener('change', () => updateFileCount(existingImageInput, imageCount, existingImageInput.previousElementSibling));
    extractImageInput.addEventListener('change', () => updateFileCount(extractImageInput, extractImageCount, extractImageInput.previousElementSibling));

    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const formData = new FormData(this);
            const xhr = new XMLHttpRequest();
            xhr.open(this.method, this.action);
            xhr.upload.onprogress = updateProgress;
            xhr.onload = function () {
                if (xhr.status === 200) {
                    const contentDisposition = xhr.getResponseHeader('Content-Disposition');
                    const fileName = contentDisposition.split('filename=')[1].replace(/"/g, '');
                    const blob = new Blob([xhr.response], { type: xhr.getResponseHeader('Content-Type') });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    a.download = fileName;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                } else {
                    alert('An error occurred during the upload.');
                }
                hideLoading();
            };
            xhr.onerror = function () {
                alert('An error occurred during the upload.');
                hideLoading();
            };
            xhr.responseType = 'blob';
            xhr.send(formData);
            showLoading();
        });
    });
});

function showLoading() {
    const loadingBar = document.getElementById('loadingBar');
    const loadingProgress = document.getElementById('loadingProgress');
    loadingBar.style.display = 'block';
    let width = 0;
    const interval = setInterval(() => {
        if (width >= 100) {
            clearInterval(interval);
        } else {
            width++;
            loadingProgress.style.width = width + '%';
        }
    }, 10);
}

function hideLoading() {
    const loadingBar = document.getElementById('loadingBar');
    const loadingProgress = document.getElementById('loadingProgress');
    loadingBar.style.display = 'none';
    loadingProgress.style.width = '0%';
}

function updateProgress(event) {
    if (event.lengthComputable) {
        const percentComplete = (event.loaded / event.total) * 100;
        const loadingProgress = document.getElementById('loadingProgress');
        loadingProgress.style.width = percentComplete + '%';
    }
}