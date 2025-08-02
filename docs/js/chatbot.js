document.addEventListener("DOMContentLoaded", () => {
const chatBtn = document.getElementById("chat-button"); // fixed chat icon
const chatBox = document.getElementById("chat-box"); // chatbot window
const closeBtn = document.getElementById("close-chat"); // close chat button
const form = document.getElementById("chat-form"); // form wrapper
const input = document.getElementById("chat-input"); // input field
const messages = document.getElementById("messages"); // message log

    // When chat icon is clicked, hide icon and show chat
    chatBtn.addEventListener("click", () => {
        chatBox.classList.toggle("d-none");
        chatBtn.classList.add("hidden");
        input.focus();
    });

    // when chat is closed show chat icon
    closeBtn.addEventListener("click", () => {
        chatBox.classList.add("d-none");
        chatBtn.classList.remove("hidden");
    });

    form.addEventListener("submit", async (e) => {
    e.preventDefault(); // prevent form reload
    const query = input.value.trim(); // user input

    // validate if user has entered something and is not empty
    if (!query) {
        appendMessage("bot", "Please enter a medication name.");
        return;
    }


    appendMessage("user", query); // display user message 
    input.value = ""; // clear input field 

    try {
        // Validate drug name using RxNav external API
        const rxRes = await fetch(`/api/medication-suggestions?name=${encodeURIComponent(query)}`);
        const rxData = await rxRes.json();
        const groups = rxData?.drugGroup?.conceptGroup || [];

        // matching input to a known drug by name
        const match = groups
        .flatMap(g => g.conceptProperties || [])
        .find(p => p.name.toLowerCase().includes(query.toLowerCase()));

        if (!match) {
        appendMessage("bot", "I couldn't identify this medication. Try a more accurate name.");
        return;
        }

        // Fetch side effects from OpenFDA using drug name
        const fdaRes = await fetch(`/api/openfda-adverse-events?name=${encodeURIComponent(query)}`);
        const fdaData = await fdaRes.json();

        if (!fdaData.results || fdaData.results.length < 10) {
        appendMessage("bot", "No reliable data found for this drug.");
        return;
        }

        // Aggregate and count common reactions
        const reactionMap = {};
        fdaData.results.forEach(result => {
        (result.patient?.reaction || []).forEach(r => {
            const reaction = r.reactionmeddrapt;
            if (reaction && reaction.length > 3) {
            reactionMap[reaction] = (reactionMap[reaction] || 0) + 1;
            }
        });
    });

    // Get top 5 most frequent reactions
    const topReactions = Object.entries(reactionMap)
      .sort((a, b) => b[1] - a[1]) // sort by desc
      .slice(0, 5) // top 5 
      .map(([name]) => name); // retrieve name only

    if (topReactions.length > 0) {
      appendMessage("bot", `Top reported side effects: ${topReactions.join(", ")}`);
    } else {
      appendMessage("bot", "No significant side effects found.");
    }
  } catch (err) {
    console.error(err);
    appendMessage("bot", "Failed to fetch info. Please try again.");
  }
});

    // append a new message to the chat log
    function appendMessage(sender, text) {
        const div = document.createElement("div");
        div.className = sender === "user" ? "message-user" : "message-bot";
        div.textContent = text;
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    }
});


