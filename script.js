let intervalId = null; // インターバルIDを保持する変数

document.addEventListener("DOMContentLoaded", () => {
    // ページが読み込まれたときに位置情報の取得を開始
    getLocation();
    // 5秒ごとにgetLocationを呼び出す
    intervalId = setInterval(getLocation, 5000);
});

function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
        alert("このブラウザでは位置情報がサポートされていません。");
    }
}

function showPosition(position) {
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;

    var url = "https://cyberjapandata2.gsi.go.jp/general/dem/scripts/getelevation.php?lon=" + lon + "&lat=" + lat + "&outtype=JSON";

    fetch(url)
        .then(response => response.json())
        .then(data => {
            var elevation = data.elevation;
            console.log("Elevation: " + elevation);

            var images = document.querySelectorAll(".map-image");

            // 標高に基づいて視点角度を計算
            var minElevation = 0;
            var maxElevation = 300;
            var minAngle = 50; // 最低角度（度）
            var maxAngle = -50; // 最高角度（度）

            // 標高に基づいて視点角度を線形に補間
            var angle = minAngle + ((elevation - minElevation) / (maxElevation - minElevation)) * (maxAngle - minAngle);

            // すべての画像に角度に応じた変形を適用
            images.forEach(img => {
                img.style.transform = `rotateX(${angle}deg)`;
            });

            // 標高の表示
            var element = document.getElementById("elevation");
            element.textContent = "標高: " + elevation + " m";
        })
        .catch(error => {
            console.error("Error fetching JSON data:", error);
        });
}

function showError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert("位置情報の取得が拒否されました。");
            break;
        case error.POSITION_UNAVAILABLE:
            alert("位置情報を取得できませんでした。");
            break;
        case error.TIMEOUT:
            alert("位置情報の取得がタイムアウトしました。");
            break;
        case error.UNKNOWN_ERROR:
            alert("未知のエラーが発生しました。");
            break;
    }
}
