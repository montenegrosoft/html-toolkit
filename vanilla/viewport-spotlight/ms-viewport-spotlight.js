(() => {

    const targets = document.querySelectorAll('.ms-viewport-spotlight')
    if (!targets.length) return

    const overlay = document.createElement('div')
    overlay.className = 'ms-viewport-spotlight-overlay'
    document.body.appendChild(overlay)

    function checkCenter() {
        let active = false

        targets.forEach(el => {
            const rect = el.getBoundingClientRect()
            const viewportCenter = window.innerHeight / 2
            const elementCenter = rect.top + rect.height / 2

            const isVisible =
                rect.top < window.innerHeight &&
                rect.bottom > 0

            const isCentered =
                Math.abs(viewportCenter - elementCenter) < rect.height / 3

            if (isVisible && isCentered) active = true
        })

        overlay.style.opacity = active ? '1' : '0'
    }

    window.addEventListener('scroll', checkCenter, { passive: true })
    window.addEventListener('resize', checkCenter)
    window.addEventListener('load', checkCenter)

})()