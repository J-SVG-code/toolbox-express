let selectedFile = null;

// Evento para seleccionar imagen
document.getElementById('imageInput').addEventListener('change', function(e) {
    if (e.target.files.length > 0) {
        selectedFile = e.target.files[0];
        document.getElementById('fileName').innerText = selectedFile.name + ` (${(selectedFile.size / 1024).toFixed(1)} KB)`;
    }
});

// Evento para cambiar el texto del rango de calidad
document.getElementById('qualityRange').addEventListener('input', function(e) {
    document.getElementById('qualityVal').innerText = e.target.value + '%';
});

// Evento para procesar la imagen
document.getElementById('processBtn').addEventListener('click', function() {
    if (!selectedFile) {
        alert("Por favor, selecciona una imagen primero.");
        return;
    }

    const format = document.getElementById('formatSelect').value;
    const quality = parseFloat(document.getElementById('qualityRange').value) / 100;

    const reader = new FileReader();
    reader.onload = function(event) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);

            // Convertir y comprimir
            const dataUrl = canvas.toDataURL(format, quality);

            // Mostrar resultado
            const resultArea = document.getElementById('resultArea');
            const downloadBtn = document.getElementById('downloadBtn');
            const sizeInfo = document.getElementById('sizeInfo');

            // Estimar tamaño comprimido en KB
            const head = 'data:' + format + ';base64,';
            const newSizeBytes = Math.round((dataUrl.length - head.length) * 3 / 4);
            const newSizeKB = (newSizeBytes / 1024).toFixed(1);

            sizeInfo.innerText = `Tamaño optimizado: ${newSizeKB} KB`;
            downloadBtn.href = dataUrl;

            // Extensión de archivo según formato
            let ext = 'jpg';
            if (format === 'image/png') ext = 'png';
            if (format === 'image/webp') ext = 'webp';

            downloadBtn.download = `imagen_toolbox_${Date.now()}.${ext}`;
            resultArea.style.display = 'block';
        };
        img.src = event.target.result;
    };
    reader.readAsDataURL(selectedFile);
});
