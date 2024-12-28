<p>
    Readify is a React Native application built using Expo, designed for small business owners on social media platforms. It allows users to efficiently manage their clients, add products, and place orders for easy tracking. Additionally, the application features an invoice generation system to provide a more professional and authentic experience for business owners.
</p>

<hr>

<h2>Setup Instructions</h2>

<h3>Backend Configuration</h3>

<ul>
    <li><strong>Connect MongoDB</strong>: Set up your MongoDB instance by connecting it to the backend. Update the following in your backend configuration:
        <ul>
            <li>MongoDB URI</li>
            <li>Database name</li>
            <li>Collection name</li>
            <li>Ensure your MongoDB instance is running and accessible.</li>
        </ul>
    </li>
    <li><strong>Cloudinary Integration</strong>: Sign up for <a href="https://cloudinary.com/">Cloudinary</a>. If you already have an account, that's great! After signing up, obtain your Cloudinary credentials (Library name, API keys, and secret). Paste your Cloudinary credentials into the backend configuration to enable image uploading.</li>
</ul>

<h3>Frontend Configuration</h3>

<ul>
    <li><strong>Configuring API URL</strong>: Locate the <code>config.js</code> file in the frontend directory:
        <pre>Readify-Frontend > components > Constants > config.js</pre>
    </li>
    <li>Inside this file, find the <code>API_BASE_URL</code> variable and update it with the IP address of the machine running the backend server:</li>
    <ul>
        <li>Replace the placeholder IP address with your machine's IP address. For example:
            <pre>export const API_BASE_URL = 'http://192.168.100.9:5000/api';</pre>
        </li>
        <li>If you're running the backend on your own machine, update it as follows:
            <pre>export const API_BASE_URL = 'http://100.146.110.6:5000/api';</pre>
        </li>
    </ul>
</ul>

<h3>Final Steps</h3>
<ul>
    <li>Once the above configurations are set, ensure the backend and frontend are connected and working.</li>
    <li>Start the backend server and the frontend application.</li>
</ul>

<p><strong>You're all set! Enjoy using <i>Readify</i> to manage your small business operations more efficiently.</strong></p>
