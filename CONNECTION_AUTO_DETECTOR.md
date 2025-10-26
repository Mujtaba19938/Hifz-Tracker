# Connection Auto-Detector System

This system automatically detects and connects to the backend server, solving the common issue of mobile Expo clients not being able to reach the backend during development.

## 🚀 Features

- **Automatic Network Detection**: Scans all local network interfaces to find accessible backend servers
- **Health Check Integration**: Tests backend connectivity using `/api/health` endpoint
- **Dynamic URL Updates**: Updates API_BASE_URL at runtime when a working connection is found
- **Comprehensive Error Handling**: Provides detailed troubleshooting information when backend is unreachable
- **Development & Production Support**: Works seamlessly in both Expo development and production builds
- **Real-time Status Monitoring**: Live connection status with automatic retry mechanisms

## 📁 File Structure

```
utils/
├── networkDetector.ts          # Core network detection logic
services/
├── enhancedApi.ts              # Enhanced API service with auto-detection
├── autoDetectingApi.ts         # Complete API service with all endpoints
├── connectionInitializer.ts    # Initialization and setup service
└── api.ts                      # Updated existing API service with fallback
components/
├── ConnectionStatus.tsx        # Connection status display component
└── ConnectionManager.tsx       # App-level connection management
hooks/
└── useConnectionStatus.ts     # React hook for connection management
```

## 🔧 How It Works

### 1. Network Interface Detection
The system scans common local network ranges:
- `192.168.1.x` - Most common home router range
- `192.168.0.x` - Alternative home router range  
- `192.168.2.x` - Some routers use this
- `10.0.0.x` - Corporate networks
- `172.16.0.x` - Docker default
- `localhost` and `127.0.0.1` - Local fallbacks

### 2. Backend Health Check
For each detected IP, the system:
- Tests connectivity to `http://{ip}:5000/api/health`
- Measures response time
- Validates JSON response format
- Caches successful connections

### 3. Automatic Fallback
If the primary API_BASE_URL fails:
- Automatically triggers network detection
- Tests multiple IP addresses in parallel
- Updates the working URL dynamically
- Provides detailed error logging

## 🛠️ Integration

### Basic Integration

```tsx
import { ConnectionManager } from './components/ConnectionManager';

export default function App() {
  return (
    <ConnectionManager showStatusIndicator={true}>
      {/* Your app content */}
    </ConnectionManager>
  );
}
```

### Advanced Integration with Hook

```tsx
import { useConnectionStatus } from './hooks/useConnectionStatus';

function MyComponent() {
  const { status, refreshConnection, checkConnection } = useConnectionStatus();
  
  return (
    <View>
      <Text>Status: {status.isConnected ? 'Connected' : 'Disconnected'}</Text>
      <Button title="Refresh" onPress={refreshConnection} />
    </View>
  );
}
```

### Manual API Usage

```tsx
import { autoDetectingApiService } from './services/autoDetectingApi';

// Check backend status
const status = await autoDetectingApiService.checkBackendStatus();

// Force refresh connection
const newUrl = await autoDetectingApiService.refreshBackendUrl();

// Use the service for API calls
const users = await autoDetectingApiService.getAllUsers();
```

## 🔍 Troubleshooting

### Common Issues

1. **Backend Not Running**
   ```
   Solution: Start the backend server
   npm run start:backend
   ```

2. **Firewall Blocking Port 5000**
   ```
   Solution: Allow port 5000 in firewall settings
   Windows: Windows Defender Firewall
   Mac: System Preferences > Security & Privacy
   ```

3. **Device and Computer on Different Networks**
   ```
   Solution: Ensure both devices are on the same WiFi network
   ```

4. **Backend Running on Different Port**
   ```
   Solution: Update the port in networkDetector.ts
   ```

### Debug Information

The system provides comprehensive logging:
- Network interface detection results
- Connection test results for each IP
- Response times and error messages
- Cached connection information
- Troubleshooting suggestions

### Manual Testing

```bash
# Test backend health directly
curl http://localhost:5000/api/health

# Test from mobile device (replace with your IP)
curl http://192.168.1.100:5000/api/health
```

## ⚙️ Configuration

### Environment Variables

```bash
# Set explicit backend URL (bypasses auto-detection)
EXPO_PUBLIC_API_BASE_URL=http://192.168.1.100:5000/api

# Production URL
EXPO_PUBLIC_API_BASE_URL=https://your-backend.com/api
```

### Custom Network Ranges

Edit `utils/networkDetector.ts` to add custom IP ranges:

```typescript
const commonRanges = [
  '192.168.1.',    // Your custom range
  '10.0.1.',       // Another custom range
  // ... existing ranges
];
```

### Timeout Configuration

```typescript
const options = {
  timeout: 5000,    // 5 second timeout
  retries: 2,       // 2 retry attempts
  port: 5000,       // Backend port
};
```

## 🚀 Production Considerations

### Environment Detection
- **Development**: Auto-detection enabled
- **Production**: Uses configured EXPO_PUBLIC_API_BASE_URL

### Performance
- Connection detection runs in background
- Results are cached for 30 seconds
- Parallel testing with limited concurrency
- Automatic retry with exponential backoff

### Security
- Only tests local network ranges
- No external network scanning
- Secure token handling
- Proper error message sanitization

## 📊 Monitoring

### Connection Statistics
```typescript
const stats = autoDetectingApiService.getConnectionStats();
console.log('Total attempts:', stats.totalAttempts);
console.log('Successful:', stats.successfulAttempts);
console.log('Recent errors:', stats.recentErrors);
```

### Real-time Status
```typescript
const status = await autoDetectingApiService.checkBackendStatus();
console.log('Reachable:', status.reachable);
console.log('URL:', status.url);
console.log('Error:', status.error);
```

## 🔄 Migration from Existing API

The system is designed to be backward compatible:

1. **Existing API calls continue to work**
2. **Automatic fallback to auto-detection**
3. **No breaking changes to existing code**
4. **Gradual migration possible**

### Migration Steps

1. Add the ConnectionManager to your app root
2. Replace API service imports gradually
3. Add connection status indicators
4. Test in development environment
5. Deploy with confidence

## 🐛 Debugging

### Enable Debug Logging
```typescript
// Add to your app initialization
console.log('Connection debug enabled');
```

### Check Network Interfaces
```typescript
import { networkDetector } from './utils/networkDetector';
const info = networkDetector.getNetworkInfo();
console.log('Network info:', info);
```

### Manual Connection Test
```typescript
import { autoDetectingApiService } from './services/autoDetectingApi';
const result = await autoDetectingApiService.checkBackendStatus();
console.log('Connection result:', result);
```

## 📱 Mobile-Specific Considerations

### Expo Development
- Works with Expo Go app
- Supports both iOS and Android
- Handles network interface differences
- Manages connection state properly

### Production Builds
- Uses configured production URLs
- Maintains connection reliability
- Provides fallback mechanisms
- Optimized for performance

## 🔧 Advanced Usage

### Custom Health Endpoints
```typescript
const result = await networkDetector.detectBackendURL({
  healthEndpoint: '/custom/health',
  timeout: 10000,
  retries: 3,
});
```

### Connection Event Handling
```typescript
const { status } = useConnectionStatus();

useEffect(() => {
  if (status.isConnected) {
    console.log('Backend connected!');
  } else {
    console.log('Backend disconnected!');
  }
}, [status.isConnected]);
```

This system ensures your mobile Expo client can always find and connect to your backend server, eliminating the common development connectivity issues.
