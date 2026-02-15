(() => {
    function maskPhone(input) {
        let output = ''
        if (input) {
            const digits = input.replace(/\D/g, '')

            if (!input.startsWith('+')) {
                output = '+' + digits.replace(/^0+/, '').slice(0, 15)
            } else {
                output = '+' + digits.replace(/^0+/, '').slice(0, 15)
            }
        }
        return output
    }

    function parsePhone(input) {
        let output = null

        if (input) {
            const digits = input.replace(/\D/g, '').replace(/^0+/, '')

            if (digits) {
                output = '+' + digits
            }
        }

        return output
    }

    function validatePhone(input) {
        let output = false

        if (!input) {
            output = true
        } else if (input.startsWith('+')) {
            const digits = input.replace(/\D/g, '')
            if (digits && !digits.startsWith('0')) {
                output = true
            }
        }

        return output
    }

    function validateEmail(input) {
        let output = false

        if (!input) {
            output = true
        } else {
            const email = input.trim()

            if (email) {
                output = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
            }
        }

        return output
    }

    function setMessage(message, type, text) {
        if (!type || !text) return
        message.className = `alert alert-${type} mt-3`
        message.textContent = text
        message.setAttribute('data-ms-message', text)
    }

    function setLocked(target, locked) {
        target.querySelectorAll('input, select, textarea, button')
            .forEach(el => el.disabled = !!locked)
    }

    document.addEventListener('input', event => {
        const target = event.target
        if (target.tagName !== 'INPUT' || target.type !== 'tel') return

        target.value = maskPhone(target.value)
    })

    document.addEventListener('submit', async event => {
        const target = event.target
        if (!(target instanceof HTMLFormElement)) return
        event.preventDefault()

        const formData = Object.fromEntries(new FormData(target).entries())

        let message = target.querySelector('[data-ms-message]')
        let hasMessage = !!message
        if (!hasMessage) message = document.createElement('p')

        setMessage(message, 'info', 'Processing...')
        if (!hasMessage) target.appendChild(message)
        setLocked(target, true)

        for (const field of target.querySelectorAll('input, select, textarea')) {
            if (field.hasAttribute('required')) {
                const value = field.value?.trim()
                if (!value) {
                    setMessage(message, 'danger', 'Please fill in all required fields.')
                    setLocked(target, false)
                    field.classList.add('focus-ring-danger')
                    field.focus()
                    return
                } else {
                    field.classList.remove('focus-ring-danger')
                }
            }
        }

        for (const emailInput of target.querySelectorAll('input[type="email"]')) {
            const emailField = emailInput.name
            if (!emailField || !formData[emailField]) continue

            const isValid = validateEmail(emailInput.value)

            if (!isValid) {
                setMessage(message, 'danger', 'Invalid email. It must contain @ and a valid domain (e.g., gmail.com).')
                setLocked(target, false)
                emailInput.classList.add('focus-ring-danger')
                emailInput.focus()
                return
            } else {
                emailInput.classList.remove('focus-ring-danger')
            }
        }

        for (const phoneInput of target.querySelectorAll('input[type="tel"]')) {
            const phoneField = phoneInput.name
            if (!phoneField || !formData[phoneField]) continue

            const parsed = parsePhone(phoneInput.value)
            const isValid = validatePhone(parsed)

            if (!isValid) {
                setMessage(message, 'danger', 'Invalid phone number. It must start with + and cannot start with 0 after +.')
                setLocked(target, false)
                phoneInput.classList.add('focus-ring-danger')
                phoneInput.focus()
                return
            } else {
                phoneInput.classList.remove('focus-ring-danger')
            }

            formData[phoneField] = parsed
        }

        const webhookUrl = target.getAttribute('data-ms-webhook-url')
        const redirectUrl = target.getAttribute('data-ms-redirect-url')

        const metaEvent = target.getAttribute('data-ms-meta-event')
        const gaEvent = target.getAttribute('data-ms-ga-event')
        const gadsConversionLabel = target.getAttribute('data-ms-gads-conversion-label')

        if (!webhookUrl) {
            setMessage(message, 'danger', 'An error occurred. Please try again later.')
            console.error('Form fetch url is missing')
            setLocked(target, false)
            return
        }

        const formUrl = location.href

        const payload = { formData, formUrl }

        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 4000)

        try {
            const res = await fetch(webhookUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
                signal: controller.signal,
            })

            clearTimeout(timeout)

            if (!res.ok) {
                setMessage(message, 'danger', 'An error occurred. Please try again later.')
                console.error('Form fetch processing error')
                setLocked(target, false)
                return
            }
        } catch {
            setMessage(message, 'danger', 'An error occurred. Please try again later.')
            console.error('Form fetch connection error')
            setLocked(target, false)
            return
        }

        if (
            (metaEvent || gaEvent || gadsConversionLabel) &&
            typeof window.ms !== 'undefined' &&
            typeof window.ms.track === 'function'
        ) {
            const userData = {
                firstName: formData.first_name || null,
                lastName: formData.last_name || null,
                name: formData.name || null,
                email: formData.email || null,
                phone: formData.phone || null
            }

            setTimeout(() => {
                window.ms.track({ metaEvent, gaEvent, gadsConversionLabel, userData })
            }, 0)
        }

        const successMessage = target.getAttribute('data-ms-success-message')

        setMessage(message, 'success', successMessage || 'Form submitted successfully.')
        setLocked(target, false)

        if (redirectUrl) location.href = redirectUrl

        return
    })
})()