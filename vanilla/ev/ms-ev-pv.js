(() => {
    window.addEventListener('load', () => {
        if (typeof window.ms !== 'undefined' &&
            typeof window.ms.event === 'function') {
            setTimeout(() => {
                ms.event({ facebookEvent: 'PageView', googleAnalyticsEvent: 'page_view' })
            }, 0)
        }
    })
})()