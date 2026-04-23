import 'dotenv/config'
import fetch from 'node-fetch'

async function test() {
    console.log("Testing /api/notifications endpoint...");
    try {
        // We need a session cookie to bypass middleware/auth
        // But we can check if it returns 401 at least.
        const response = await fetch('http://localhost:3000/api/notifications');
        const status = response.status;
        const text = await response.text();
        console.log(`Status: ${status}`);
        console.log(`Response: ${text}`);
    } catch (e) {
        console.error("Fetch failed:", e);
    }
}

test();
