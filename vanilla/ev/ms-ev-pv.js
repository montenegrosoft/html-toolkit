(() => {
    window.addEventListener('load', () => {
        if (typeof window.ms !== 'undefined' &&
            typeof window.ms.event === 'function') {
            setTimeout(() => {
                ms.event({ metaEvent: 'PageView', gaEvent: 'page_view' })
            }, 0)
        }
    })
})()