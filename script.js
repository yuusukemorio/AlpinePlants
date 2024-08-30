document.addEventListener("DOMContentLoaded", () => {
    getLocation();
    setInterval(getLocation, 5000);
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("Geolocation is not supported by this browser.");
    }
}

function showPosition(position) {
    const lat = position.coords.latitude;
    const lon = position.coords.longitude;
    const url = `https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php?lon=${lon}&lat=${lat}&outtype=JSON`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const elevation = data.elevation;
            document.getElementById("elevation").textContent = `標高 : ${elevation} m`;

            // 画像ファイル名を生成
            const minElevation = 0;
            const maxElevation = 250;
            const fileNumber = Math.round(((elevation - minElevation) / (maxElevation - minElevation)) * 249) + 1;
            const fileName = fileNumber.toString().padStart(4, '0') + '.png';
            
            // 画像のパスを修正
            const imgPath = `img/${fileName}`;

            // 画像を更新
            const imgElement = document.getElementById("map-image");
            imgElement.src = imgPath;
        })
        .catch(error => console.error("Error fetching elevation data:", error));
}

function showError(error) {
    switch (error.code) {
        case error.PERMISSION_DENIED:
            alert("Geolocation permission denied.");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("Position information unavailable.");
            break;
        case error.TIMEOUT:
            alert("Geolocation request timed out.");
            break;
        case error.UNKNOWN_ERROR:
            alert("An unknown error occurred.");
            break;
    }
}
