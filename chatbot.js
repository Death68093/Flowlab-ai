const supabaseUrl = 'https://pjpynjhybkqoixgbwxbf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqcHluamh5Ymtxb2l4Z2J3eGJmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5MDQ1NzgsImV4cCI6MjA0NjQ4MDU3OH0.bwq4Q_V5vtErIvCBj64Jtf0DNRbPod121w9so-_JwGU';
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

async function handleChat() {
    const query = document.getElementById("userInput").value.trim();
    const messageBox = document.getElementById("messages");
    messageBox.innerHTML = ""; // Clear previous results
    let data, error;

    // Search by hashtag in description or general query in name/description
    if (query.startsWith("#")) {
        const hashtag = query.slice(1);
        ({ data, error } = await supabase
            .from('code')
            .select('*')
            .ilike('description', `%${hashtag}%`));
    } else {
        ({ data, error } = await supabase
            .from('code')
            .select('*')
            .or(`code_name.ilike.%${query}%,description.ilike.%${query}%`));
    }

    if (error) {
        messageBox.innerHTML = `<p>Error: ${error.message}</p>`;
    } else if (data.length === 0) {
        messageBox.innerHTML = `<p>No code found for "${query}".</p>`;
    } else {
        data.forEach((item, index) => {
            // Container for each code item
            const codeItem = document.createElement("div");
            codeItem.classList.add("code-item");

            // Display name and description with hidden code initially
            codeItem.innerHTML = `
                <div class="code-header">
                    <strong>${item.code_name}</strong>
                    <span>: ${item.description}</span>
                </div>
                <div id="code-${index}" class="code-content" style="display: none;">
                    <pre><code>${item.code}</code></pre>
                    <button onclick="copyCode(${index})">Copy</button>
                </div>
            `;

            // Toggle visibility of code on click
            codeItem.querySelector(".code-header").onclick = () => {
                const codeContent = document.getElementById(`code-${index}`);
                codeContent.style.display = codeContent.style.display === "none" ? "block" : "none";
            };

            messageBox.appendChild(codeItem);
        });
    }

    document.getElementById("userInput").value = ""; // Clear input field
}

// Function to copy code to clipboard
function copyCode(index) {
    const codeContent = document.querySelector(`#code-${index} pre`).textContent;
    navigator.clipboard.writeText(codeContent)
        .then(() => alert("Code copied to clipboard!"))
        .catch((err) => alert("Failed to copy code: " + err));
}
