// Cache DOM elements and use requestAnimationFrame
const weatherElements = {
    sun: document.getElementById('sun'),
    rain: document.getElementById('rain'),
    snow: document.getElementById('snow')
}

let currentWeather = null
let animationFrame = null
let particlePool = []

// Create particle pool for reuse
function initParticlePool(size) {
    for (let i = 0; i < size; i++) {
        particlePool.push({
            rain: document.createElement('div'),
            snow: document.createElement('div')
        })
        particlePool[i].rain.className = 'raindrop'
        particlePool[i].snow.className = 'snowflake'
    }
}

function setWeather(type) {
    if (currentWeather === type) return
    
    // Cancel any pending animation
    if (animationFrame) {
        cancelAnimationFrame(animationFrame)
    }

    // Batch DOM operations
    requestAnimationFrame(() => {
        Object.values(weatherElements).forEach(elem => {
            elem.classList.add('fade-out', 'hidden')
        })

        const element = weatherElements[type === 'sunny' ? 'sun' : 
                                     type === 'rainy' ? 'rain' : 'snow']
        
        element.classList.remove('hidden')
        element.classList.add('fade-in')
        
        if (type === 'rainy') {
            createRaindrops()
        } else if (type === 'snowy') {
            createSnowflakes()
        }
    })
    
    currentWeather = type
}

function clearParticles() {
    weatherElements.rain.innerHTML = ''
    weatherElements.snow.innerHTML = ''
}

function createRaindrops() {
    clearParticles()
    const fragment = document.createDocumentFragment()
    
    for (let i = 0; i < 40; i++) {
        const drop = particlePool[i].rain.cloneNode()
        drop.style.cssText = `
            left: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 2}s
        `
        fragment.appendChild(drop)
    }
    
    weatherElements.rain.appendChild(fragment)
}

function createSnowflakes() {
    clearParticles()
    const fragment = document.createDocumentFragment()
    
    for (let i = 0; i < 50; i++) {
        const flake = particlePool[i].snow.cloneNode()
        const size = Math.random() * 4 + 2
        flake.style.cssText = `
            left: ${Math.random() * 100}%;
            animation-delay: ${Math.random() * 6}s;
            opacity: ${Math.random() * 0.4 + 0.6};
            width: ${size}px;
            height: ${size}px
        `
        fragment.appendChild(flake)
    }
    
    weatherElements.snow.appendChild(fragment)
}

// Initialize
initParticlePool(50)
setWeather('sunny') 