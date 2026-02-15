window.addEventListener('load', function () {
    var metaUrl = document.querySelector('meta[name="ms-cd-redirect-url"]');
    if (!metaUrl) return;

    var url = metaUrl.getAttribute('content');
    if (!url) return;

    var metaSecs = document.querySelector('meta[name="ms-cd-redirect-secs"]');
    var seconds = 10;

    if (metaSecs && !isNaN(parseInt(metaSecs.getAttribute('content'), 10))) {
        seconds = parseInt(metaSecs.getAttribute('content'), 10);
    }

    var counterEl = document.getElementById('ms-cd-redirect');
    var remaining = seconds;

    var interval = setInterval(function () {
        remaining--;

        if (counterEl && remaining >= 0) {
            counterEl.innerHTML = remaining;
        }

        if (remaining <= 0) {
            clearInterval(interval);
            window.location.href = url;
        }
    }, 1000);
});
