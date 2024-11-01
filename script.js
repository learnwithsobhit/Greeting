document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('startButton');
  const nameInput = document.getElementById('nameInput');
  const container = document.querySelector('.container');
  const welcome = document.querySelector('.welcome');
  const personalizedMessage = document.getElementById('personalizedMessage');
  const backgroundMusic = document.getElementById('backgroundMusic');
  const firecrackerSound = document.getElementById('firecrackerSound');
  const crackers = document.querySelectorAll('.cracker');

  startButton.addEventListener('click', () => {
    const name = nameInput.value.trim();
    
    const visitorData = {
      name: name,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent
    };

    // Send to MongoDB
    fetch('/.netlify/functions/store-greeting', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(visitorData)
    })
    .then(response => response.json())
    .catch(error => console.error('Error storing greeting:', error));


    // Send notification via Netlify function
    fetch('/.netlify/functions/send-telegram', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(visitorData)
    })
    .then(response => response.json())
    .then(data => console.log('Notification sent:', data))
    .catch(error => console.error('Error sending notification:', error));

    // Set personalized message if name is provided
    if (name) {
      headMessage.textContent = `🎆 Happy Diwali,  ${name}! 🎆`;
    }

    // Play background music
    backgroundMusic.play()
      .then(() => console.log("Background music started successfully."))
      .catch((error) => console.error("Background music play failed:", error));

    // Hide the welcome section and show the greeting card
    welcome.style.display = 'none';
    container.classList.remove('hidden');

    // Play firecracker sounds and color animation
    crackers.forEach((cracker, index) => {
      setInterval(() => {
        cracker.style.backgroundColor = getRandomColor();
        firecrackerSound.currentTime = 0; // Reset sound to play each time
        firecrackerSound.play()
          .catch((error) => console.error("Firecracker sound play failed:", error));
      }, 1000 * (index + 1)); // Stagger sounds for each cracker
    });
  });

  function getRandomColor() {
    const colors = ['#f93943', '#ffcf47', '#ff6347', '#ffd700', '#ff4500'];
    return colors[Math.floor(Math.random() * colors.length)];
  }
});