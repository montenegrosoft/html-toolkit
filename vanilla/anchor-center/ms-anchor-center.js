(() => {

    function centerElement(el) {
        el.scrollIntoView({
            behavior: 'smooth',
            block: 'center'
        })
    }

    document.addEventListener('click', e => {

        const link = e.target.closest('a[href^="#"]')
        if (!link) return

        const hash = link.getAttribute('href')
        if (!hash || hash === '#') return

        const target = document.querySelector(hash)
        if (!target) return

        e.preventDefault()
        centerElement(target)

    })

})()
