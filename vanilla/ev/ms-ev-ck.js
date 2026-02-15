(() => {
    document.addEventListener('click', function (e) {
        const target = e.target.closest('a.ms-tr, button.ms-tr')
        if (!target) return

        const metaEvent = target.getAttribute('data-ms-meta-event')
        const gaEvent = target.getAttribute('data-ms-ga-event')
        const gadsConversionLabel = target.getAttribute('data-ms-gads-conversion-label')

        if (
            (metaEvent || gaEvent || gadsConversionLabel) &&
            typeof window.ms !== 'undefined' &&
            typeof window.ms.event === 'function'
        ) {
            setTimeout(() => {
                window.ms.event({ metaEvent, gaEvent, gadsConversionLabel })
            }, 0)
        }
    })
})()