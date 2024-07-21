document.addEventListener("DOMContentLoaded", () => {
  const destinationContainer = document.getElementsByClassName("destination-container")[0];
  const searchButton = document.getElementById("search-btn");
  const searchInput = document.getElementById("search");

  async function displayDestinations(filterLocation = "") {
    try {
      const response = await fetch("https://json-server-fhn5.onrender.com/destinations");
      const result = await response.json();

      // Clear previous results
      destinationContainer.innerHTML = "";

      // Filter destinations by location if filterLocation is provided
      const filteredResults = filterLocation
        ? result.filter((item) =>
            item.name.toLowerCase().includes(filterLocation.toLowerCase())
          )
        : result;

      // Display filtered destinations
      filteredResults.forEach((item) => {
        const destinationWrapper = document.createElement("div");
        destinationWrapper.classList.add("destination-wrapper");

        const destination = document.createElement("div");
        destination.classList.add("destination");

        // Check if images property exists and is an array
        const images = Array.isArray(item.images) ? item.images : [];
        console.log(images)
        // Display multiple images
       images.forEach((imgSrc) => {
          const destinationImage = document.createElement("img");
          destinationImage.src = imgSrc;
          destinationImage.classList.add("destination-image");
          
          // Error handling for image loading
          destinationImage.onerror = () => {
            console.error(`Failed to load image: ${imgSrc}`);
            destinationImage.alt = "Image not available";
            destinationImage.src = "https://via.placeholder.com/150"; // Placeholder image
          };
          
          destinationImage.addEventListener("click", () => openModal(imgSrc));
          destination.appendChild(destinationImage);
        });

        const destinationName = document.createElement("h3");
        destinationName.classList.add("destination-name")
        destinationName.innerHTML = item.name;
        destination.appendChild(destinationName);

        const bookButton = document.createElement("button");
        bookButton.innerText = "Book Now";
        bookButton.classList.add("book-now")
        bookButton.addEventListener("click", () => openBookingForm(item.id));
        destination.appendChild(bookButton);

        destinationWrapper.appendChild(destination);
        destinationContainer.appendChild(destinationWrapper);
      });

      console.log(filteredResults);
    } catch (err) {
      console.log("something went wrong", err);
    }
  }
  displayDestinations();

  searchButton.addEventListener("click", () => {
    console.log(searchInput.value);
    displayDestinations(searchInput.value);
  });

  searchInput.addEventListener("input", (e) => {
    displayDestinations(e.target.value);
  });

  // Open booking form function
  function openBookingForm(destinationId) {
    const bookingFormContainer = document.createElement("div");
    bookingFormContainer.classList.add("booking-form-container");

    const bookingForm = document.createElement("form");
    bookingForm.classList.add("booking-form");

    const heading = document.createElement("h2");
    heading.innerText = "Booking Form";

    const nameLabel = document.createElement("label");
    nameLabel.innerText = "Name:";

    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.name = "name";
    nameInput.required = true;

    const emailLabel = document.createElement("label");
    emailLabel.innerText = "Email:";

    const emailInput = document.createElement("input");
    emailInput.type = "email";
    emailInput.name = "email";
    emailInput.required = true;

    const dateLabel = document.createElement("label");
    dateLabel.innerText = "Date:";

    const dateInput = document.createElement("input");
    dateInput.type = "date";
    dateInput.name = "date";
    dateInput.required = true;

    const submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.innerText = "Book Now";

    bookingForm.appendChild(heading);
    bookingForm.appendChild(nameLabel);
    bookingForm.appendChild(nameInput);
    bookingForm.appendChild(emailLabel);
    bookingForm.appendChild(emailInput);
    bookingForm.appendChild(dateLabel);
    bookingForm.appendChild(dateInput);
    bookingForm.appendChild(submitButton);
    bookingFormContainer.appendChild(bookingForm);
    document.body.appendChild(bookingFormContainer);

    // Handle form submission
    bookingForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const bookingData = {
        destinationId: destinationId,
        name: nameInput.value,
        email: emailInput.value,
        date: dateInput.value,
      };

      try {
        const response = await fetch("https://json-server-fhn5.onrender.com/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(bookingData),
        });

        if (response.ok) {
          alert("Booking successful!");
          document.body.removeChild(bookingFormContainer);
        } else {
          alert("Failed to book. Please try again.");
        }
      } catch (err) {
        alert("An error occurred. Please try again.");
        console.error(err);
      }
    });
  }

  // Open modal function
  function openModal(imgSrc) {
    const modal = document.createElement("div");
    modal.classList.add("modal");

    const modalContent = document.createElement("div");
    modalContent.classList.add("modal-content");

    const modalImage = document.createElement("img");
    modalImage.src = imgSrc;
    modalImage.classList.add("modal-image");

    const closeButton = document.createElement("span");
    closeButton.classList.add("close-button");
    closeButton.innerHTML = "&times;";
    closeButton.addEventListener("click", () => {
      document.body.removeChild(modal);
    });

    modalContent.appendChild(closeButton);
    modalContent.appendChild(modalImage);
    modal.appendChild(modalContent);
    document.body.appendChild(modal);
  }
});
