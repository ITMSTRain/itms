import { config } from './config.js';

const supabaseUrl = config.SUPABASE_URL;
const supabaseKey = config.SUPABASE_KEY;
const supabase = window.supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", function () {

  
  console.log("API Base URL:", config.API_BASE_URL);

  let activeStreams = {};  
  let selectedVideoItem = null;
  let videos = [];

  async function fetchData() {
      const { data, error } = await supabase
          .from("videos")
          .select("video_name");

      if (error) {
          console.error("❌ Error fetching data:", error);
          return;
      }

      // Extract only the video names into an array like ["vid1", "vid2", "vid3"]
      videos = data.map(video => video.video_name);

      console.log("✅ Extracted Video List:", videos);

      loadCameraList();

      // Pass the list of video names
  }


  function toggleHighlight(el) {
      if (el.classList.contains("highlighted")) {
          gsap.to(el, { backgroundColor: "lightgray", boxShadow: "none", duration: 0.3 });
          el.classList.remove("highlighted");
      } else {
          gsap.to(el, { backgroundColor: "yellow", boxShadow: "0 0 10px gold", duration: 0.3 });
          el.classList.add("highlighted");
      }
  }

    
  // 🟢 FUNCTION TO SELECT VIDEO SLOT
  function selectElement(el) {
    if (selectedVideoItem === el) {
        gsap.to(el, { backgroundColor: "lightgray", boxShadow: "none", duration: 0.3 });
        selectedVideoItem = null;
    } else {
        document.querySelectorAll(".video-item").forEach(item => 
            gsap.to(item, { backgroundColor: "lightgray", boxShadow: "none", duration: 0.3 })
        );
        gsap.to(el, { backgroundColor: "gray", boxShadow: "0 0 10px blue", duration: 0.3 });
        selectedVideoItem = el;
    }
  }

  async function cameraListClick(cameraName) {
    if (!selectedVideoItem) {
        alert("Please select a video item first.");
        return;
    }

    // Get the ID of the selected slot
    let imgElement = selectedVideoItem.querySelector("img");

    if (!imgElement) {
        console.warn("🚨 No img element found in the selected video slot!");
        return;
    }

    let slotId = imgElement.id; // Example: "video-feed-0"
    console.log(`🎥 Moving ${cameraName} to slot ${slotId}`);

    // Make sure this slot isn't already streaming another video
    if (imgElement.dataset.streaming) {
        console.warn(`⚠️ Slot ${slotId} is already streaming ${imgElement.dataset.streaming}!`);
        return;
    }

    // Mark the slot as occupied
    imgElement.dataset.streaming = cameraName;

    // Start the stream
    startStream(cameraName, slotId);
  }



  let camera_api =[]

  function loadCameraList() {
    const cameraList = document.getElementById("camera-list");
    cameraList.innerHTML = "";  // Clear existing items

    videos.forEach(videoName => {
        const li = document.createElement("li");
        li.textContent = videoName;
        li.onclick = function () { cameraListClick(videoName); };
        cameraList.appendChild(li);
    });
  }

  // 🟢 FUNCTION TO START WEBSOCKET STREAM
// Track active WebSockets

  async function startStream(cameraId, imgElementId) {
    if (activeStreams[cameraId]) {
        console.warn(`🚨 Already streaming ${cameraId}`);
        return;
    }

    function reconnect() {
        console.log(`🔄 Reconnecting ${cameraId}...`);
        delete activeStreams[cameraId];
        setTimeout(() => startStream(cameraId, imgElementId), 3000); // Wait 3 sec before retry
    }

    let ws = new WebSocket(`ws://127.0.0.1:8000/ws/videos/${cameraId}`);
    let imgElement = document.getElementById(imgElementId);

    ws.binaryType = "blob";
    activeStreams[cameraId] = ws;

    ws.onmessage = (event) => {
        let blob = event.data;
        let url = URL.createObjectURL(blob);
        imgElement.src = url;
    };

    ws.onclose = () => {
        console.warn(`🚨 WebSocket for ${cameraId} closed!`);
        reconnect();
    };
  }



  window.loadCameraList = loadCameraList;
  window.fetchData = fetchData;

  const videoGrid = document.querySelector(".video-grid");
  // 🟢 FUNCTION TO UPDATE VIDEO GRID LAYOUT
  function updateVideoGrid(layout) {
    videoGrid.innerHTML = "";  // Clear existing videos
    let numVideos = parseInt(layout[0]) ** 2;  // e.g., "2x2" → 4 videos

    videoGrid.style.gridTemplateColumns = `repeat(${Math.sqrt(numVideos)}, 1fr)`;
    videoGrid.style.gridTemplateRows = `repeat(${Math.sqrt(numVideos)}, 1fr)`;

    for (let i = 0; i < numVideos; i++) {
        const videoItem = document.createElement("div");
        videoItem.classList.add("video-item");
        videoItem.onclick = () => selectElement(videoItem);

        const videoFeed = document.createElement("img");
        videoFeed.id = `video-feed-${i}`;
        videoFeed.classList.add("video-feed");
        videoFeed.src = "assets/errorvideo.jpg";  // Default placeholder
        videoItem.appendChild(videoFeed);

        videoGrid.appendChild(videoItem);
    }
  }




// Load default layout (1x1)
updateVideoGrid("2x2");

  // User dropdown variables
  const userButton = document.querySelector(".user-button");
  const userDropdown = document.querySelector(".dropdown");

  // Classification dropdown variables
  const classificationBtn = document.querySelector(
    ".classification-dropdown button"
  );
  const dropdownMenu = document.querySelector(
    ".classification-dropdown .dropdown-menu"
  );

  // Toggle user dropdown visibility
  userButton.addEventListener("click", (event) => {
    event.stopPropagation(); // Prevents click from closing the dropdown immediately
    userDropdown.classList.toggle("visible");
  });

  // Toggle classification dropdown visibility
  classificationBtn.addEventListener("click", (event) => {
    event.stopPropagation();
    dropdownMenu.classList.toggle("visible");
  });

  // Close dropdowns when clicking outside
  document.addEventListener("click", (event) => {
    if (!event.target.closest(".user-menu")) {
      userDropdown.classList.remove("visible");
    }
    if (!event.target.closest(".classification-dropdown")) {
      dropdownMenu.classList.remove("visible");
    }
  });

  document.querySelectorAll(".dropdown-list").forEach(item => {
    item.addEventListener("click", function() {
        toggleHighlight(this);
    });
  });

  // Fullscreen button
  const fullscreenBtn = document.querySelector("#fullscreen-btn");


  fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
      videoGrid.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  });

  // Modal Handling
  const closeModalButton = document.getElementById("close-modal-button");
  const modal = document.getElementById("modal");
  const overlay = document.getElementById("overlay");


 

  closeModalButton.addEventListener("click", () => {
    modal.style.display = "none";
    overlay.style.display = "none";
  });

  // Video Layout Handling
  const layoutButtons = document.querySelectorAll(".left-btn");
    // Add event listeners to layout buttons
    layoutButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const layout = button.getAttribute("data-layout");
        updateVideoGrid(layout);
      });
    });

    

});
const buttons = document.querySelectorAll(".top-btn");
const modalBody = document.querySelector(".modal-body");
const modalHeader = document.querySelector(".modal-header");

   buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const modalId = button.getAttribute("modal-button");
      const modalheaderElement = document.getElementById(`${modalId}-header`);
      const modalContentElement = document.getElementById(`${modalId}-content`);

      if (modalContentElement) {
        modalBody.innerHTML = modalContentElement.innerHTML;
        modalHeader.innerHTML = modalheaderElement.innerHTML;
        modal.style.display = "block";
        overlay.style.display = "block";
      } else {
        console.error(`Modal content not found for ID: ${modalId}`);
      }
    });
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

// Get contexts for each chart
const ctx_pb = document.getElementById('speedGraph').getContext('2d');

let dataPoints_pb = [];
let averageValues_pb = [];
let startTime_pb = Date.now();
let inputValues_pb = [];


// Create the chart for PB
const chart_pb = new Chart(ctx_pb, {
  type: 'line',
  data: {
    labels: ["0 - 30s"],
    datasets: [{
      label: 'Average Speed (PB)',
      data: [0],
      backgroundColor: 'rgba(192, 75, 75, 0.6)',  // Different color for PB
      borderColor: 'rgba(192, 75, 75, 1)',
      borderWidth: 1,
    }]
  },
  options: {
    scales: {
      x: { beginAtZero: true },
      y: { beginAtZero: true }
    },
  }
});

// Function to process values from inputValues for PB chart
function processDataPoint_pb() {
  if (inputValues_pb.length > 0) {
    const value = inputValues_pb.shift();
    dataPoints_pb.push(value);
    const elapsedTime = (Date.now() - startTime_pb) / 1000;

    if (elapsedTime < 30) {
      const avg = dataPoints_pb.reduce((sum, val) => sum + val, 0) / dataPoints_pb.length;
      chart_pb.data.datasets[0].data[chart_pb.data.datasets[0].data.length - 1] = avg;
      chart_pb.update();
    } else {
      const avg = dataPoints_pb.reduce((sum, val) => sum + val, 0) / dataPoints_pb.length;
      averageValues_pb.push(avg);
      chart_pb.data.labels.push(`${averageValues_pb.length * 30} - ${(averageValues_pb.length + 1) * 30}s`);
      chart_pb.data.datasets[0].data.push(avg);
      chart_pb.update();

      dataPoints_pb = [];
      startTime_pb = Date.now();
    }
  }
}




async function fetchSpeedData(endpoint, arrayList) {
  try {
      const response = await fetch(endpoint);
      const data = await response.json();

      // Retrieve the latest speed value for display
      const speeds = Object.values(data.latest_speed);
      const latestSpeed = speeds.length > 0 ? speeds[speeds.length - 1] : "No data";

      arrayList.push(latestSpeed);
  } catch (error) {
      console.error("Error fetching speed data:", error);
  }
}

// // Fetch data every 5 seconds
// setInterval(fetchClassificationData("http://localhost:8000/PB_vehicle_classifications"), 500);


// // Fetch PB and BSU speed and Vehicle Count data every .5 seconds
// setInterval(() => {
//   fetchSpeedData("http://localhost:8000/PB_latest_speed", "pb-speed",  inputValues_pb);
// }, 500);

// setInterval(() => {
//   processDataPoint_pb();
// }, 500);
