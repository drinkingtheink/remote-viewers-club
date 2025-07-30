<template>
  <div class="sig-gallery-container stage">
    <div class="header">
      <h3>Club Membership Roll:</h3>
      <button @click="refreshData" :disabled="loading">
        {{ loading ? 'Loading...' : 'Refresh Data' }}
      </button>
    </div>
    
    <div v-if="loading" class="loading">
      <div class="spinner"></div>
      <p>Loading members...</p>
    </div>
    
    <div v-else-if="error" class="error">
      <h3>⚠️ Error Loading Data</h3>
      <p>{{ error }}</p>
      <button @click="refreshData">Try Again</button>
    </div>
    
    <div v-else-if="items.length === 0" class="empty">
      <h3>📝 No Members Found</h3>
      <p>No data found in the spreadsheet.</p>
      <button @click="refreshData">Refresh</button>
    </div>
    
    <div v-else class="content">
      <div class="stats">
        <p>{{ items.length }} member{{ items.length !== 1 ? 's' : '' }}</p>
        <small v-if="lastUpdated">Last updated: {{ formatDate(lastUpdated) }}</small>
      </div>
      
      <div class="items-grid">
        <div 
          v-for="(item, index) in items" 
          :key="item.id || index"
          class="item-card"
        >
          <div class="card-header">
            <h3>{{ item.title || item.printedName || 'Untitled' }}</h3>
            <span class="item-id">#{{ item.id }}</span>
          </div>
          
          <div class="image-container">
            <img 
              v-if="item.image && isValidBase64Image(item.image)" 
              :src="item.image" 
              :alt="`Signature by ${item.title}`"
              class="signature-image"
              @error="handleImageError($event, index)"
              @load="handleImageLoad"
            />
            <div v-else class="no-image">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
                <polyline points="14,2 14,8 20,8"/>
                <line x1="16" y1="13" x2="8" y2="13"/>
                <line x1="16" y1="17" x2="8" y2="17"/>
                <polyline points="10,9 9,9 8,9"/>
              </svg>
              <span>No signature image</span>
            </div>
          </div>
          <div v-if="item.timestamp" class="timestamp">
            <small><bold>JOINED:</bold> {{ formatDate(item.timestamp) }}</small>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { eventBus } from '../EventBus'

// Reactive data
const items = ref([])
const loading = ref(false)
const error = ref(null)
const lastUpdated = ref(null)

// Configuration - Replace with your actual Google Apps Script web app URL
// This should be the URL you got when you deployed your Apps Script as a web app
const APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxKQRUEBU8e1skP35pZzZslfgWLtkeeAqdL57M1oSwEqw-pEhQ1jksIrzhwd_KraiSt/exec'

// Add this for debugging - remove in production
console.log('Apps Script URL being used:', APPS_SCRIPT_URL)

// Validate base64 image format
const isValidBase64Image = (str) => {
  if (!str || typeof str !== 'string') return false
  
  // Check if it's a proper data URL format
  const dataUrlRegex = /^data:image\/(png|jpg|jpeg|gif|webp|svg\+xml);base64,/
  return dataUrlRegex.test(str)
}

// Format date for display
const formatDate = (dateString) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleString()
  } catch (e) {
    return dateString
  }
}

// Fetch data from Google Apps Script using a more reliable approach
const fetchSheetData = async () => {
  try {
    loading.value = true
    error.value = null

    console.log('🚀 Starting fetch from Google Apps Script...')
    console.log('📍 URL:', APPS_SCRIPT_URL)

    // Check if URL is properly configured
    if (APPS_SCRIPT_URL.includes('YOUR_ACTUAL_SCRIPT_ID_HERE')) {
      throw new Error('Please update APPS_SCRIPT_URL with your actual Google Apps Script deployment URL')
    }

    // Method 1: Try with no-cors mode (this often works with Apps Script)
    console.log('📡 Attempting fetch with no-cors mode...')
    
    try {
      const response = await fetch(APPS_SCRIPT_URL, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-cache'
      })
      
      console.log('📨 No-cors response received:', response)
      
      // With no-cors, we can't read the response, so let's try a different approach
      throw new Error('no-cors mode limits response access')
      
    } catch (noCorsError) {
      console.log('📡 No-cors failed, trying cors mode...')
      
      // Method 2: Try regular CORS request
      const response = await fetch(APPS_SCRIPT_URL + '?_=' + Date.now(), {
        method: 'GET',
        mode: 'cors',
        credentials: 'omit',
        headers: {
          'Accept': 'application/json'
        }
      })
      
      console.log('📨 Response status:', response.status)
      console.log('📨 Response URL:', response.url)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
      }
      
      console.log('✅ Response received, parsing JSON...')
      const result = await response.json()
      
      console.log('📦 Parsed result:', result)
      
      if (!result.success) {
        throw new Error(result.error || result.message || 'Unknown error from Apps Script')
      }
      
      // Process the successful response
      items.value = result.data.reverse() || []
      lastUpdated.value = result.lastUpdated || new Date().toISOString()
      
      console.log(`✨ Successfully loaded ${items.value.length} items`)
    }
    
  } catch (err) {
    console.error('❌ Error fetching sheet data:', err)
    
    error.value = err.message
    
    // Provide helpful error messages based on common issues
    if (err.message.includes('YOUR_ACTUAL_SCRIPT_ID_HERE')) {
      error.value = '❌ Please update the APPS_SCRIPT_URL with your actual Google Apps Script deployment URL.'
    } else if (err.message.includes('Failed to fetch')) {
      error.value = '❌ Network error. Your Google Apps Script may not be deployed correctly or may not be publicly accessible.'
    } else if (err.message.includes('CORS')) {
      error.value = '❌ CORS error. Please check that your Google Apps Script is deployed with "Anyone" access and try refreshing the page.'
    } else {
      error.value = `❌ ${err.message}. Please verify your Google Apps Script deployment settings.`
    }
  } finally {
    loading.value = false
  }
}

// Enhanced JSONP method that works with Google Apps Script
// const fetchWithJSONP = () => {
//   return new Promise((resolve, reject) => {
//     const callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random())
    
//     console.log('📞 Creating JSONP request with callback:', callbackName)
    
//     // Create script element
//     const script = document.createElement('script')
//     script.src = `${APPS_SCRIPT_URL}?callback=${callbackName}&timestamp=${Date.now()}`
    
//     console.log('📞 JSONP URL:', script.src)
    
//     // Set up callback
//     window[callbackName] = (data) => {
//       console.log('📞 JSONP callback received data:', data)
//       delete window[callbackName]
//       document.body.removeChild(script)
//       resolve(data)
//     }
    
//     // Handle errors
//     script.onerror = () => {
//       console.error('📞 JSONP script failed to load')
//       delete window[callbackName]
//       document.body.removeChild(script)
//       reject(new Error('JSONP request failed - script could not be loaded'))
//     }
    
//     // Add script to document
//     document.body.appendChild(script)
//     console.log('📞 JSONP script added to document')
    
//     // Cleanup after timeout
//     setTimeout(() => {
//       if (window[callbackName]) {
//         console.error('📞 JSONP request timeout')
//         delete window[callbackName]
//         if (document.body.contains(script)) {
//           document.body.removeChild(script)
//         }
//         reject(new Error('JSONP request timeout - no response received within 15 seconds'))
//       }
//     }, 15000) // 15 second timeout
//   })
// }

// Handle image loading errors
const handleImageError = (event, index) => {
  console.error(`Image failed to load for item ${index}:`, event.target.src)
  event.target.style.display = 'none'
}

// Handle successful image load
const handleImageLoad = () => {
  console.log('Signature image loaded successfully')
}

// Refresh data method
const refreshData = () => {
  fetchSheetData()
}

// Fetch data on component mount
onMounted(() => {
  refreshData()
  eventBus.on('confirmSigSaved', refreshData)
})
</script>

<style>
.sig-gallery-container .container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.sig-gallery-container .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 0.5px solid #e9ecef;
}

.sig-gallery-container .loading {
  text-align: center;
  padding: 60px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
}

.sig-gallery-container .spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid red;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.sig-gallery-container .error, .sig-gallery-container .empty {
  text-align: center;
  padding: 40px 20px;
  border-radius: 12px;
  border: 1px solid #dee2e6;
}

.sig-gallery-container .error {
  border-color: #fed7d7;
  color: #c53030;
}

.sig-gallery-container .error h3, .sig-gallery-container .empty h3 {
  margin: 0 0 12px 0;
  font-size: 20px;
}

.sig-gallery-container .content {
  animation: fadeIn 0.5s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.sig-gallery-container .stats {
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  text-align: center;
}

.sig-gallery-container .stats p {
  margin: 0 0 4px 0;
  font-weight: 500;
}

.sig-gallery-container .items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.sig-gallery-container .item-card {
  border: 1px solid #454647;
  border-radius: 16px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  background-color: rgba(0,0,0,0.35);
}

.sig-gallery-container .item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0,0,0,0.85);
  background-color: rgba(0,0,0,0.8);
}

.sig-gallery-container .card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.sig-gallery-container .card-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  flex: 1;
}

.sig-gallery-container .item-id {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.sig-gallery-container .image-container {
  margin-bottom: 16px;
  border-radius: 12px;
  overflow: hidden;
}

.sig-gallery-container .signature-image {
  width: 100%;
  height: 200px;
  object-fit: contain;
  border: 1px solid #373738;
}

.sig-gallery-container .no-image {
  width: 100%;
  height: 200px;
  border: 1px dashed #dee2e6;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.sig-gallery-container .item-description {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 12px;
}

.sig-gallery-container .timestamp {
  padding-top: 12px;
  border-top: 0.5px solid rgba(0,0,0,0.08);
}

.sig-gallery-container .timestamp small {
  font-size: 12px;
}

.sig-gallery-container {
    width: 90% !important;
    margin: 3rem auto 0 auto !important;
}
</style>