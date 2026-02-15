(() => {

    const SPEED = {
        1: 1.2,
        2: 2.4,
        3: 3.6,
        4: 4.8
    }

    document.querySelectorAll('.ms-auto-carousel').forEach(track => {

        track.addEventListener('dragstart', e => e.preventDefault())

        const levelAttr = parseInt(track.dataset.xSpeed, 10)
        const level = SPEED[levelAttr] ? levelAttr : 2
        const speed = SPEED[level]

        let baseWidth = 0
        let position = 0
        let isDown = false
        let startX = 0
        let startPosition = 0

        function build() {
            const content = track.innerHTML
            track.innerHTML = content + content
            baseWidth = track.scrollWidth / 2
        }

        function normalize() {
            if (!baseWidth) return
            if (position <= -baseWidth) position += baseWidth
            if (position >= 0) position -= baseWidth
        }

        function loop() {
            if (!isDown) {
                position -= speed
                normalize()
                track.style.transform = `translate3d(${position}px,0,0)`
            }
            requestAnimationFrame(loop)
        }

        function down(e) {
            isDown = true
            startX = e.touches ? e.touches[0].clientX : e.clientX
            startPosition = position
        }

        function move(e) {
            if (!isDown) return
            const x = e.touches ? e.touches[0].clientX : e.clientX
            position = startPosition + (x - startX)
            normalize()
            track.style.transform = `translate3d(${position}px,0,0)`
        }

        function up() {
            isDown = false
        }

        function init() {
            build()
            loop()
        }

        window.addEventListener('load', init)

        track.addEventListener('mousedown', down)
        window.addEventListener('mousemove', move)
        window.addEventListener('mouseup', up)

        track.addEventListener('touchstart', down, { passive: true })
        window.addEventListener('touchmove', move, { passive: true })
        window.addEventListener('touchend', up)

    })

})()
