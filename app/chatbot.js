// Chatbot functionality for Medcal
document.addEventListener('DOMContentLoaded', function() {
  const chatbotToggle = document.getElementById('chatbot-toggle');
  const chatbotClose = document.getElementById('chatbot-close');
  const chatbotWindow = document.getElementById('chatbot-window');
  const chatbotInput = document.getElementById('chatbot-input');
  const chatbotSend = document.getElementById('chatbot-send');
  const chatbotMessages = document.getElementById('chatbot-messages');

  // Toggle chatbot window
  if (chatbotToggle) {
    chatbotToggle.addEventListener('click', function() {
      chatbotWindow.classList.toggle('hidden');
      if (!chatbotWindow.classList.contains('hidden')) {
        chatbotInput.focus();
      }
    });
  }

  // Close chatbot
  if (chatbotClose) {
    chatbotClose.addEventListener('click', function() {
      chatbotWindow.classList.add('hidden');
    });
  }

  // Medical knowledge base
  const medicalResponses = {
    hello: "Hello! I'm your medical assistant. I can help you with medical information, find doctors, and book appointments.",
    hi: "Hi there! How can I assist you today?",
    doctors: "I can help you find doctors. What specialty are you looking for? (e.g., Cardiology, Dermatology, General Practice)",
    appointment: "I can help you book an appointment. Please tell me what you need.",
    pain: "I'm sorry to hear you're experiencing pain. Can you tell me more about the location and intensity? (1-10)",
    fever: "A fever can indicate an infection. Have you had other symptoms like cough, sore throat, or body aches? I recommend consulting a doctor.",
    cough: "A cough can be caused by many things - allergies, cold, or infection. How long have you had it? I'd suggest seeing a doctor if it persists.",
    headache: "Headaches can have various causes. Please rest and stay hydrated. If it persists, consider seeing a doctor.",
    symptoms: "Please describe your symptoms in detail so I can better assist you.",
    book: "To book an appointment, please tell me: 1) Which specialty? 2) Your preferred date? 3) Your contact information?",
    thank: "You're welcome! Is there anything else I can help you with?",
    thanks: "You're welcome! Feel free to ask if you need anything else.",
    bye: "Goodbye! Take care and stay healthy!",
    default: "I'm here to help with medical information and appointment booking. How can I assist you?"
  };

  // Function to get response
  function getBotResponse(userMessage) {
    const message = userMessage.toLowerCase().trim();
    
    // Check for keywords
    for (const [key, response] of Object.entries(medicalResponses)) {
      if (message.includes(key)) {
        return response;
      }
    }

    // Default response
    return medicalResponses.default;
  }

  // Send message
  function sendMessage() {
    const message = chatbotInput.value.trim();
    if (message === '') return;

    // Add user message
    const userMessageEl = document.createElement('div');
    userMessageEl.className = 'chatbot-message user';
    userMessageEl.innerHTML = `<p>${escapeHtml(message)}</p>`;
    chatbotMessages.appendChild(userMessageEl);

    // Clear input
    chatbotInput.value = '';

    // Simulate bot thinking
    setTimeout(() => {
      const botResponse = getBotResponse(message);
      const botMessageEl = document.createElement('div');
      botMessageEl.className = 'chatbot-message bot';
      botMessageEl.innerHTML = `<p>${botResponse}</p>`;
      chatbotMessages.appendChild(botMessageEl);

      // Auto scroll to bottom
      chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
    }, 500);

    // Auto scroll to bottom
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  // Send button click
  if (chatbotSend) {
    chatbotSend.addEventListener('click', sendMessage);
  }

  // Enter key to send
  if (chatbotInput) {
    chatbotInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        sendMessage();
      }
    });
  }

  // Escape HTML
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});
