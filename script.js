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
    
    if (animationFrame) {
        cancelAnimationFrame(animationFrame)
    }

    // Clear previous weather state
    clearParticles()
    
    // Hide all weather elements first
    Object.values(weatherElements).forEach(elem => {
        elem.classList.add('hidden')
    })

    // Show new weather element
    const element = weatherElements[type === 'sunny' ? 'sun' : 
                                 type === 'rainy' ? 'rain' : 'snow']
    
    element.classList.remove('hidden')
    
    // Set active button state
    document.querySelectorAll('button').forEach(btn => {
        btn.classList.remove('ring-2', 'ring-white')
        if (btn.textContent.toLowerCase().includes(type)) {
            btn.classList.add('ring-2', 'ring-white')
        }
    })

    if (type === 'rainy') {
        animationFrame = requestAnimationFrame(createRaindrops)
    } else if (type === 'snowy') {
        animationFrame = requestAnimationFrame(createSnowflakes)
    }
    
    currentWeather = type
}

function clearParticles() {
    weatherElements.rain.innerHTML = ''
    weatherElements.snow.innerHTML = ''
}

function createRaindrops() {
    // 只在雨滴数量少于25时添加新的雨滴
    if (weatherElements.rain.children.length < 25) {
        const fragment = document.createDocumentFragment()
        
        for (let i = 0; i < 25; i++) {
            const drop = particlePool[i].rain.cloneNode()
            drop.style.cssText = `
                left: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 4}s;
            `
            // 添加动画结束监听器，自动移除结束的雨滴
            drop.addEventListener('animationend', () => {
                drop.remove()
            })
            fragment.appendChild(drop)
        }
        
        weatherElements.rain.appendChild(fragment)
    }
    
    if (currentWeather === 'rainy') {
        animationFrame = requestAnimationFrame(createRaindrops)
    }
}

function createSnowflakes() {
    // 只在雪花数量少于30时添加新的雪花
    if (weatherElements.snow.children.length < 50) {
        const fragment = document.createDocumentFragment()
        
        for (let i = 0; i < 50; i++) {
            const flake = particlePool[i].snow.cloneNode()
            const size = Math.random() * 1.5 + 0.5
            flake.style.cssText = `
                left: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 8}s;
                opacity: ${Math.random() * 0.3 + 0.4};
                width: ${size}px;
                height: ${size}px;
            `
            // 添加动画结束监听器，自动移除结束的雪花
            flake.addEventListener('animationend', () => {
                flake.remove()
            })
            fragment.appendChild(flake)
        }
        
        weatherElements.snow.appendChild(fragment)
    }
    
    if (currentWeather === 'snowy') {
        animationFrame = requestAnimationFrame(createSnowflakes)
    }
}

// Initialize
initParticlePool(50)
setWeather('sunny') 