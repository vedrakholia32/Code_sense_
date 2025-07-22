# 🧪 ErrorSense Testing Examples

Copy and paste these error examples into the ErrorSense web interface to test different functionalities:

## 1. **JavaScript Runtime Error**
```
ReferenceError: userName is not defined
    at main (/Users/dev/project/app.js:15:13)
    at Object.<anonymous> (/Users/dev/project/app.js:25:1)
    at Module._compile (internal/modules/cjs/loader.js:1063:30)
    at Object.Module._extensions..js (internal/modules/cjs/loader.js:1092:10)
```

## 2. **TypeScript Compilation Error**
```
error TS2339: Property 'firstName' does not exist on type '{ name: string; age: number; }'.
src/components/UserProfile.tsx(42,18): error TS2339: Property 'firstName' does not exist on type '{ name: string; age: number; }'.
    console.log(user.firstName);
                     ~~~~~~~~~
```

## 3. **React JSX Error**
```
Warning: React.createElement: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: undefined. You likely forgot to export your component from the file it's defined in, or you might have mixed up default and named imports.
    in App (at src/index.js:7)
```

## 4. **Node.js Module Error**
```
Error: Cannot find module 'express'
Require stack:
- /Users/dev/project/server.js
    at Function.Module._resolveFilename (internal/modules/cjs/loader.js:815:15)
    at Function.Module._load (internal/modules/cjs/loader.js:667:27)
    at Module.require (internal/modules/cjs/loader.js:887:19)
```

## 5. **Python Error**
```
Traceback (most recent call last):
  File "main.py", line 15, in <module>
    result = calculate_average(numbers)
  File "main.py", line 8, in calculate_average
    return sum(nums) / len(nums)
ZeroDivisionError: division by zero
```

## 6. **Database Connection Error**
```
MongoNetworkError: failed to connect to server [localhost:27017] on first connect [Error: connect ECONNREFUSED 127.0.0.1:27017
    at TCPConnectWrap.afterConnect [as oncomplete] (net.js:1141:16)] {
  name: 'MongoNetworkError'
}
```

## 7. **API/Network Error**
```
TypeError: Failed to fetch
    at fetchUserData (src/api/users.js:12:5)
    at async UserComponent.componentDidMount (src/components/User.js:18:7)
CORS error: Cross-Origin Request Blocked: The Same Origin Policy disallows reading the remote resource at https://api.example.com/users
```

## 8. **Syntax Error**
```
SyntaxError: Unexpected token '}' in JSON at position 45
    at JSON.parse (<anonymous>)
    at parseResponse (src/utils/api.js:23:10)
    at processAPIResponse (src/services/dataService.js:67:15)
```

## 9. **Security-Related Error**
```
Content Security Policy: The page's settings blocked the loading of a resource at inline ("script-src").
Refused to execute inline script because it violates the following Content Security Policy directive: "script-src 'self'"
```

## 10. **Performance Warning**
```
Warning: Can't perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application.
    at UserProfile (src/components/UserProfile.jsx:45:8)
```

## 🎯 **Test Scenarios**

### **Scenario A: Basic Error Analysis**
1. Copy Error #1 (JavaScript Runtime Error)
2. Paste into ErrorSense
3. Click "🔍 Analyze Error"
4. Verify you see:
   - Severity classification
   - Root cause analysis
   - Quick fix suggestions
   - Step-by-step solution

### **Scenario B: Advanced UI Features**
1. Use Error #2 (TypeScript Error)
2. Check all 4 tabs: Overview | Solution | Learning | Quality
3. Test copy-to-clipboard functionality
4. Verify confidence ratings appear

### **Scenario C: Security Analysis**
1. Use Error #9 (Security Error)
2. Check if security concerns are identified
3. Verify prevention tips are provided

### **Scenario D: Multi-Language Support**
1. Test Error #5 (Python Error)
2. Verify language-specific advice
3. Check debugging techniques

## 🛠 **Testing Without OpenAI API**

If you don't have an OpenAI API key yet, you can test with mock responses by temporarily modifying the API route to return sample data.

## 🔌 **VS Code Extension Testing**

### **Setup Steps:**
1. **Install Extension Dependencies**
   ```bash
   cd vscode-extension
   npm install
   npm run compile
   ```

2. **Configure Extension Settings**
   - Open VS Code Settings (Ctrl+,)
   - Search "ErrorSense"
   - Set API URL: `http://localhost:3000/api/explain_error`
   - Set API Key: `your-secret-key`
   - Enable Auto Detect: `true`

### **VS Code Extension Test Scenarios:**

#### **Test 1: Manual Error Explanation**
1. Open a JavaScript file in VS Code
2. Type this error text:
   ```javascript
   // Paste this error and select it:
   ReferenceError: userName is not defined at main.js:15:13
   ```
3. Select the error text
4. Press `Ctrl+Shift+E` (or `Cmd+Shift+E` on Mac)
5. Verify webview panel opens with analysis

#### **Test 2: Context Menu Integration**
1. Select an error message in any file
2. Right-click → "Explain Error with ErrorSense"
3. Verify analysis appears in side panel

#### **Test 3: Auto-Detection**
1. Create a file with syntax errors:
   ```javascript
   // test.js
   const user = {
     name: "John"
     age: 30  // Missing comma - this will show red squiggles
   };
   console.log(user.firstName); // Property doesn't exist
   ```
2. Wait for VS Code to show error squiggles
3. Hover over the error - should see ErrorSense analysis

#### **Test 4: Command Palette**
1. Press `Ctrl+Shift+P`
2. Type "ErrorSense"
3. Try each command:
   - "ErrorSense: Explain Error"
   - "ErrorSense: Toggle Auto Error Detection"
   - "ErrorSense: Clear Error History"

## 🚀 **Step-by-Step Testing Process**

### **Phase 1: Web Application Testing**
```bash
# 1. Start the web app
cd errosense
npm run dev

# 2. Open http://localhost:3000
# 3. Test with errors from examples above
```

### **Phase 2: Extension Development Testing**
```bash
# 1. Open VS Code in extension directory
cd vscode-extension
code .

# 2. Press F5 to launch Extension Development Host
# 3. Test extension features in the new VS Code window
```

### **Phase 3: Full Integration Testing**
1. Have both web app running AND extension installed
2. Test web interface first
3. Then test VS Code extension
4. Verify both use same API and return consistent results
