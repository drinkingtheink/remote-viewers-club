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

// Fetch the membership roll from Google Apps Script.
const fetchSheetData = async () => {
  try {
    loading.value = true
    error.value = null

    // Cache-busted so a returning member sees signatures added since last visit.
    const response = await fetch(`${APPS_SCRIPT_URL}?_=${Date.now()}`, {
      method: 'GET',
      mode: 'cors',
      credentials: 'omit',
      headers: {
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`)
    }

    const result = await response.json()

    if (!result.success) {
      throw new Error(result.error || result.message || 'Unknown error from Apps Script')
    }

    // Newest signatures first.
    items.value = (result.data || []).reverse()
    lastUpdated.value = result.lastUpdated || new Date().toISOString()
  } catch (err) {
    console.error('Error fetching the membership roll:', err)

    if (err.message.includes('Failed to fetch')) {
      error.value = 'Network error. The membership roll could not be reached.'
    } else if (err.message.includes('CORS')) {
      error.value = 'CORS error. The membership roll could not be reached.'
    } else {
      error.value = err.message
    }
  } finally {
    loading.value = false
  }
}

// Handle image loading errors
const handleImageError = (event, index) => {
  console.error(`Image failed to load for item ${index}:`, event.target.src)
  event.target.style.display = 'none'
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
  font-family: var(--font-body);
}

.sig-gallery-container .header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 0.5px solid var(--gilt-dim);
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
  border: 4px solid var(--leather-raised);
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
  border: 1px solid var(--gilt-dim);
}

.sig-gallery-container .error {
  border-color: #fed7d7;
  color: #c53030;
}

.sig-gallery-container .error h3, .sig-gallery-container .empty h3 {
  margin: 0 0 12px 0;
  font-size: var(--text-md);
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
  font-size: var(--text-md);
  font-weight: 600;
  flex: 1;
}

.sig-gallery-container .item-id {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: var(--text-xs);
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
  border: 1px dashed var(--gilt-dim);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.sig-gallery-container .item-description {
  font-size: var(--text-sm);
  line-height: 1.5;
  margin-bottom: 12px;
}

.sig-gallery-container .timestamp {
  padding-top: 12px;
  border-top: 0.5px solid rgba(0,0,0,0.08);
}

.sig-gallery-container .timestamp small {
  font-size: var(--text-xs);
}

.sig-gallery-container {
    width: 90% !important;
    margin: 3rem auto 0 auto !important;
}

.sig-gallery-container h3 {
    margin-top: 0;
}
</style>