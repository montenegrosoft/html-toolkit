(() => {
    document.addEventListener('click', function (e) {
        const target = e.target.closest('a.ms-tr, button.ms-tr')
        if (!target) return

        const metaEvent = target.getAttribute('data-ms-meta-event')
        const gaEvent = target.getAttribute('data-ms-ga-event')
        const gadsConversionLabel = target.getAttribute('data-ms-gads-conversion-label')

        if (!metaEvent && !gaEvent && !gadsConversionLabel) return
        if (typeof ms.track !== 'function') return

        setTimeout(() => {
            ms.track({ metaEvent, gaEvent, gadsConversionLabel })
        }, 0)
    })
})()