document.addEventListener("DOMContentLoaded", function () {
  // User dropdown variables
  const userButton = document.querySelector(".user-button");
  const userDropdown = document.querySelector(".dropdown");

  // Classification dropdown variables
  const classificationBtn = document.querySelector('.classification-dropdown button');
  const dropdownMenu = document.querySelector('.classification-dropdown .dropdown-menu');

  // Toggle user dropdown visibility
  userButton.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent click from closing dropdown immediately
    userDropdown.classList.toggle("visible");
  });

  // Toggle classification dropdown visibility
  classificationBtn.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevent click from closing dropdown immediately
    dropdownMenu.classList.toggle("visible");
  });

  // Close any open dropdown when clicking outside
  document.addEventListener("click", (event) => {
    // Close the user dropdown if clicked outside
    if (!event.target.closest(".user-menu")) {
      userDropdown.classList.remove("visible");
    }
    
    // Close the classification dropdown if clicked outside
    if (!event.target.closest('.classification-dropdown')) {
      dropdownMenu.classList.remove('visible');
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  // Fullscreen button variable
  const fullscreenBtn = document.querySelector('#fullscreen-btn');
  const videoPlayer = document.querySelector('.video-container');

  // Toggle fullscreen mode
  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      // Enter fullscreen mode
      videoPlayer.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      // Exit fullscreen mode
      document.exitFullscreen().catch((err) => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  });
});

  
// Get elements
const closeModalButton = document.getElementById('close-modal-button');
const modal = document.getElementById('modal');
const overlay = document.getElementById('overlay');

const buttons = document.querySelectorAll('.top-btn');
const modalBody = document.querySelector('.modal-body');
const modalHeader = document.querySelector('.modal-header');


buttons.forEach(button => {
  button.addEventListener('click', () => {
    // Get the modal ID from the button's `modal-button` attribute
    const modalId = button.getAttribute('modal-button');
    console.log('Modal ID:', modalId); // Debugging log

    // Find the corresponding modal content
    const modalheaderElement = document.getElementById(`${modalId}-header`);
    const modalContentElement = document.getElementById(`${modalId}-content`);

    if (modalContentElement) {
      // If the content exists, update the modal body
      modalBody.innerHTML = modalContentElement.innerHTML;
      modalHeader.innerHTML = modalheaderElement.innerHTML;

      // Show the modal
      modal.style.display = 'block';
      overlay.style.display = 'block';
    } else {
      console.error(`Modal content not found for ID: ${modalId}`);
    }
  });
});


// Close modal function
closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
    overlay.style.display = 'none';
});



// Get the context for the vehicle classification chart
const ctx_vehicleClassification = document.getElementById('vehicleClassificationGraph').getContext('2d');
// Initialize separate arrays for PB and BSU vehicle classifications
let VehicleClassificationData = [];

// Create the chart for vehicle classification
const chart_vehicleClassification = new Chart(ctx_vehicleClassification, {
  type: 'bar',
  data: {
    labels: [], // Vehicle categories
    datasets: [
      {
        label: 'Vehicle Count',
        data: [],
        backgroundColor: 'rgba(192, 75, 75, 0.6)',
        borderColor: 'rgba(192, 75, 75, 1)',
        borderWidth: 1,
      }
    ],
  },
  options: {
    scales: {
      x: {
        title: { display: true, text: 'Vehicle Classification', font: { weight: 'bold', size: 14 } },
      },
      y: {
        title: { display: true, text: 'Count', font: { weight: 'bold', size: 14 } },
      },
    },
  },
});

// Fetch and process data from /PB_Vehicle_Classification
function fetchClassificationData(class_endpoint) {
  fetch(class_endpoint)
    .then((response) => response.json())
    .then((data) => {
      VehicleClassificationData = Object.entries(data.vehicle_classifications).map(([key, value]) => ({
        classification: key,
        count: value,
      }));
      updateClassificationChart();
    })
    .catch((error) => console.error("Error fetching PB classification data:", error));
}

// Update the vehicle classification chart
function updateClassificationChart() {
  // Combine classifications from both arrays
  const classifications = new Set([
    ...VehicleClassificationData.map((item) => item.classification),
  ]);
  // Update the labels (x-axis)
  chart_vehicleClassification.data.labels = Array.from(classifications);
  // Map the data for PB and BSU based on the classifications
  const Data = chart_vehicleClassification.data.labels.map((label) =>
    VehicleClassificationData.find((item) => item.classification === label)?.count || 0
  );

  // Update chart datasets
  chart_vehicleClassification.data.datasets[0].data = Data;
  chart_vehicleClassification.update();
}
// Fetch data every 5 seconds
setInterval(fetchClassificationData, 500);
