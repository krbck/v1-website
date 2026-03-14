const delay = ms => new Promise(res => setTimeout(res, ms));

function showLoading() {
    document.getElementById('loading-overlay').classList.add('active');
}

function hideLoading() {
    document.getElementById('loading-overlay').classList.remove('active');
}

async function loadMessages() {
    showLoading();
    try {
        const res = await fetch("/api/messages");
        const messages = await res.json();

        const list = messages.map(m => `
      <li>
        ${m.message} <small>[${m.created_at ? new Date(m.created_at).toLocaleString() : 'no timestamp'}]</small>
        <button onclick="deleteMessage(${m.id})">Delete</button>
      </li>
    `).join("");

        document.getElementById("messageList").innerHTML = list;
    } catch (e) {
        console.error("Failed to load messages:", e);
    } finally {
        hideLoading();
    }
}

async function sendMessage() {
    const message = document.getElementById("messageInput").value;
    if (!message.trim()) return alert("Please type a message");

    showLoading();
    try {
        await fetch("/api/messages", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message })
        });
        document.getElementById("messageInput").value = "";
    } catch (e) {
        console.error("Failed to send message:", e);
    } finally {
        hideLoading();
    }
    loadMessages();
}

async function deleteMessage(id) {
    if (!confirm("Are you sure you want to delete this message?")) return;

    showLoading();
    try {
        await fetch(`/api/messages/${id}`, { method: "DELETE" });
    } catch (e) {
        console.error("Failed to delete message:", e);
    } finally {
        hideLoading();
    }
    loadMessages();
}

// Load messages on page load
loadMessages();
