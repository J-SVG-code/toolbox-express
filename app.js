const imageInput = document.getElementById('imageInput');
const fileNameSpan = document.getElementById('fileName');
const formatSelect = document.getElementById('formatSelect');
const qualityRange = document.getElementById('qualityRange');
const qualityVal = document.getElementById('qualityVal');
const processBtn = document.getElementById('processBtn');
const resultArea = document.getElementById('resultArea');
const sizeInfo = document.getElementById('sizeInfo');
const downloadBtn = document.getElementById('downloadBtn');

let selectedFile = null;

qualityRange.addEventListener('input', (e) => {
    qualityVal.textContent = e.target.value;
});

imageInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
        selectedFile = e.target.files[0];
        fileNameSpan.textContent = selectedFile.name;
    }
});

processBtn.addEventListener('click', () => {
    if (!selectedFile) {
        alert('Por favor selecciona una imagen primero.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            const outputFormat = formatSelect.value;
            const quality = parseInt(qualityRange.value) / 100;

            const dataUrl = canvas.toDataURL(outputFormat, quality);
            
            // Calcular tamaño aproximado en KB
            const base64Len = dataUrl.length - (dataUrl.indexOf(',') + 1);
            const sizeInKb = Math.round((base64Len * 3/4) / 1024);

            sizeInfo.textContent = `Tamaño optimizado aprox: ${sizeInKb} KB`;
            downloadBtn.href = dataUrl;
            
            // Extensión del archivo
            let ext = 'jpg';
            if (outputFormat === 'image/png') ext = 'png';
            if (outputFormat === 'image/webp') ext = 'webp';
            downloadBtn.download = `toolbox_optimizada.${ext}`;

            resultArea.style.display = 'block';
        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(selectedFile);
});
