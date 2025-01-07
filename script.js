document.addEventListener("DOMContentLoaded", function () {
  const usernameInput = document.getElementById("usernameInput");
  const addUsernameBtn = document.getElementById("addUsernameBtn");
  const userListUl = document.getElementById("userListUl");
  const usernameSelect = document.getElementById("usernameSelect");
  const confirmBtn = document.getElementById("confirmBtn");
  const hoursInput = document.getElementById("hoursInput");
  const minutesInput = document.getElementById("minutesInput");
  const manualExpInput = document.getElementById("manualExpInput");
  const addManualExpBtn = document.getElementById("addManualExpBtn");
  const removeSelectedBtn = document.getElementById("removeSelectedBtn");

  // Load user data from local storage
  function loadUserData() {
    const savedUserList = JSON.parse(localStorage.getItem("userList"));
    if (savedUserList) {
      savedUserList.forEach(user => {
        addUserToList(user.username, user.exp);
      });
    }
  }

  // Add a new username to the list and dropdown
  function addUserToList(username, exp = 0) {
    // Add to the user list
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <input type="checkbox" class="user-checkbox">
      <span class="username-exp">${username} (${exp} EXP)</span>
    `;
    userListUl.appendChild(listItem);

    // Add to the dropdown
    const option = document.createElement("option");
    option.value = username;
    option.textContent = username;
    usernameSelect.appendChild(option);
  }

  // Save user data to localStorage
  function saveUserData() {
    const userList = [];
    const listItems = document.querySelectorAll("#userListUl li");
    listItems.forEach((item) => {
      const usernameExpSpan = item.querySelector(".username-exp");
      const username = usernameExpSpan.textContent.split(" (")[0];
      const exp = parseInt(usernameExpSpan.textContent.match(/\((\d+) EXP\)/)[1]);
      userList.push({ username, exp });
    });
    localStorage.setItem("userList", JSON.stringify(userList));
  }

  // Function to add a new username
  addUsernameBtn.addEventListener("click", function () {
    const username = usernameInput.value.trim();
    if (username === "") {
      alert("Username cannot be empty.");
      return;
    }

    addUserToList(username);

    // Save the user data after adding new username
    saveUserData();

    // Clear the input
    usernameInput.value = "";
  });

  // Function to confirm and add EXP
  confirmBtn.addEventListener("click", function () {
    const selectedUsername = usernameSelect.value;
    const hours = parseInt(hoursInput.value) || 0;
    const minutes = parseInt(minutesInput.value) || 0;

    if (!selectedUsername) {
      alert("Please select a username.");
      return;
    }

    if (hours === 0 && minutes === 0) {
      alert("Please enter hours or minutes.");
      return;
    }

    let totalExp = 0;

    // Calculate EXP based on hours and minutes
    if (hours > 0) {
      totalExp += hours * 2; // 1 hour = 2 EXP
      if (hours >= 10) {
        totalExp += Math.floor(hours / 10) * 5; // Extra 5 EXP for every 10 hours
      }
    }

    if (minutes >= 30 && minutes < 50) {
      totalExp += 1; // 30 minutes = 1 EXP
    } else if (minutes >= 50) {
      totalExp += 2; // 50+ minutes = 2 EXP
    }

    // Update EXP for the selected username
    const listItems = document.querySelectorAll("#userListUl li");
    listItems.forEach((item) => {
      const usernameExpSpan = item.querySelector(".username-exp");
      const checkbox = item.querySelector(".user-checkbox");
      if (usernameExpSpan.textContent.includes(selectedUsername)) {
        // Update the EXP
        const currentExp = parseInt(
          usernameExpSpan.textContent.match(/\((\d+) EXP\)/)[1]
        );
        const updatedExp = currentExp + totalExp;
        usernameExpSpan.textContent = `${selectedUsername} (${updatedExp} EXP)`;
        checkbox.checked = false; // Uncheck if it was checked
      }
    });

    // Save the updated user data
    saveUserData();

    // Clear inputs
    hoursInput.value = "";
    minutesInput.value = "";
  });

  // Function to manually add EXP
  addManualExpBtn.addEventListener("click", function () {
    const selectedUsername = usernameSelect.value;
    const manualExp = parseInt(manualExpInput.value);

    if (!selectedUsername) {
      alert("Please select a username.");
      return;
    }

    if (isNaN(manualExp) || manualExp <= 0) {
      alert("Please enter a valid EXP value.");
      return;
    }

    const listItems = document.querySelectorAll("#userListUl li");
    listItems.forEach((item) => {
      const usernameExpSpan = item.querySelector(".username-exp");
      const checkbox = item.querySelector(".user-checkbox");
      if (usernameExpSpan.textContent.includes(selectedUsername)) {
        // Update the EXP
        const currentExp = parseInt(
          usernameExpSpan.textContent.match(/\((\d+) EXP\)/)[1]
        );
        const updatedExp = currentExp + manualExp;
        usernameExpSpan.textContent = `${selectedUsername} (${updatedExp} EXP)`;
        checkbox.checked = false; // Uncheck if it was checked
      }
    });

    // Save the updated user data
    saveUserData();

    // Clear input
    manualExpInput.value = "";
  });

  // Function to remove selected users
  removeSelectedBtn.addEventListener("click", function () {
    const checkboxes = document.querySelectorAll(".user-checkbox");
    checkboxes.forEach((checkbox) => {
      if (checkbox.checked) {
        const listItem = checkbox.parentElement;

        // Remove from dropdown
        const usernameExpSpan = listItem.querySelector(".username-exp");
        const username = usernameExpSpan.textContent.split(" (")[0];
        const options = Array.from(usernameSelect.options);
        options.forEach((option) => {
          if (option.value === username) {
            option.remove();
          }
        });

        // Remove from list
        listItem.remove();
      }
    });

    // Save the updated user data
    saveUserData();
  });

  // Load user data from local storage on page load
  loadUserData();
});
