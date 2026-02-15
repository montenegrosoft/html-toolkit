(() => {
    function uuid() {
        const buf = new Uint8Array(16)
        crypto.getRandomValues(buf)
        buf[6] = (buf[6] & 0x0f) | 0x40
        buf[8] = (buf[8] & 0x3f) | 0x80
        const hex = [...buf].map(b => b.toString(16).padStart(2, '0')).join('')
        return hex.slice(0, 8) + '-' +
            hex.slice(8, 12) + '-' +
            hex.slice(12, 16) + '-' +
            hex.slice(16, 20) + '-' +
            hex.slice(20)
    }

    document.addEventListener('DOMContentLoaded', () => {
        const metaPixelId = document.querySelector('meta[name="ms-meta-pixel-id"]')?.content || null
        const metaTestCode = document.querySelector('meta[name="ms-meta-test-code"]')?.content || null
        const gaMeasurementId = document.querySelector('meta[name="ms-ga-measurement-id"]')?.content || null
        const gadsConversionId = document.querySelector('meta[name="ms-gads-conversion-id"]')?.content || null
        const apiUrl = document.querySelector('meta[name="ms-tr-api-url"]')?.content || null

        if (metaPixelId) {
            (function (f, b, e, v, n, t, s) {
                if (f.fbq) return
                n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments) }
                f._fbq = n
                n.loaded = true
                n.version = '2.0'
                n.queue = []
                t = b.createElement(e)
                t.async = true
                t.src = v
                s = b.getElementsByTagName(e)[0]
                s.parentNode.insertBefore(t, s)
            })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js')

            if (window.fbq) {
                fbq('init', metaPixelId, {}, { autoConfig: false })
            }
        }

        if (gaMeasurementId) {
            const gaScript = document.createElement('script')
            gaScript.async = true
            gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaMeasurementId
            document.head.appendChild(gaScript)

            window.dataLayer = window.dataLayer || []
            function gtag() { dataLayer.push(arguments) }
            gtag('js', new Date())
            gtag('config', gaMeasurementId, { send_page_view: false })

            if (gadsConversionId) {
                gtag('config', gadsConversionId)
            }

            window.gtag = gtag
        }


        window.ms = window.ms || {}
        window.ms.track = function ({ metaEvent, gaEvent, gadsConversionLabel, userData }) {
            if (!metaEvent && !gaEvent && !gadsConversionLabel) return

            const eventId = uuid()
            if (!eventId) return

            let userId = null

            try {
                userId = localStorage.getItem('userId')
                if (!userId) {
                    userId = uuid()
                    localStorage.setItem('userId', userId)
                }
            } catch {
                userId = uuid()
            }

            if (metaPixelId && metaEvent && typeof window.fbq === 'function') {
                fbq('track', metaEvent, {}, {
                    eventID: eventId,
                    ...(metaTestCode && { test_event_code: metaTestCode })
                })
            }

            if (gaMeasurementId && gaEvent && typeof window.gtag === 'function') {
                const params = { event_id: eventId, page_location: location.href }
                if (gaEvent === 'page_view') params.page_referrer = document.referrer || undefined
                gtag('event', gaEvent, params)
            }

            if (gadsConversionId && gadsConversionLabel && typeof window.gtag === 'function') {
                gtag('event', 'conversion', {
                    send_to: gadsConversionId + '/' + gadsConversionLabel,
                    transaction_id: eventId
                })
            }

            const searchParams = new URLSearchParams(location.search)

            const cookieFbp = document.cookie.split('; ').find(c => c.startsWith('_fbp='))?.split('=')[1] || null
            const cookieFbc = document.cookie.split('; ').find(c => c.startsWith('_fbc='))?.split('=')[1] || null
            const cookieGclid =
                searchParams.get('gclid') ||
                document.cookie.split('; ').find(c => c.startsWith('_gcl_aw='))?.split('=')[1] ||
                document.cookie.split('; ').find(c => c.startsWith('_gcl_dc='))?.split('=')[1] ||
                null

            if (searchParams.get('gclid')) {
                document.cookie = `_gcl_aw=${cookieGclid}; path=/; mams-age=7776000; SameSite=Lax`
            }

            if (apiUrl) {
                const eventUrl = location.href

                const payload = {
                    data: {
                        metaEvent,
                        gaEvent,
                        gadsConversionLabel,
                        eventUrl,
                        eventId,
                        userId,
                        userData,
                        cookieFbp,
                        cookieFbc,
                        cookieGclid
                    },
                    meta: {
                        metaPixelId,
                        metaTestCode,
                        gaMeasurementId
                    }
                }

                fetch(apiUrl, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                    keepalive: true
                })
            }
        }
    })
})()