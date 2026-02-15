(() => {
    window.addEventListener('load', () => {
        if (typeof ms.track === 'function') {
            setTimeout(() => {
                ms.track({ facebookEvent: 'PageView', googleAnalyticsEvent: 'page_view' })
            }, 0)
        }
    })
})()