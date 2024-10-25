import { fetchUserData } from "./getDataFromGithub.js";

//Function to download generated resume
const downloadPDF = (userNameParam, userEmailParam) => {
  try {
    let targetElement = document.querySelector(".resumeContainer");

    // High-quality options for downloading
    var downloadOpt = {
      margin: [8, 0, 0, 0],
      filename: `${userNameParam}.pdf`,
      image: { type: "jpeg", quality: 1 }, // High-quality for download
      html2canvas: { scale: 2, logging: true, dpi: 192, letterRendering: true }, // Higher scale for better resolution
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    // Generate and download high-quality PDF
    html2pdf().set(downloadOpt).from(targetElement).save();

  } catch (error) {
    console.error(error);
    alert("An error occurred. Please try again.");
  }
};


// Event listener for checking each required elements are loaded or not
window.addEventListener("DOMContentLoaded", () => {
  const username = document.querySelector(".input");
  const searchUsernameContainer = document.querySelector(
    ".searchUsernameContainer"
  );
  const loadingIndicator = document.querySelector(".loadingIndicator");
  const generatedResume = document.querySelector(".resumeContainer");
  const generateResumeButton = document.querySelector(".generateButton");
  const downloadResumeButton = document.querySelector(".ResumeDownloadButton");
  let homePageVisiblity = document.querySelector(".homePageContainer");
  const buildResumeHomePageButton = document.querySelector(
    ".buildResumeHomePageButton"
  );
  const userContactDetailsInputContainerVisibility = document.querySelector(
    ".userContactDetailsInputContainer"
  );
  const navBarVisibility = document.querySelector(".navbar");
  let userNameText;
  let userEmail;

  buildResumeHomePageButton.addEventListener("click", () => {
    homePageVisiblity.style.display = "none";
    userContactDetailsInputContainerVisibility.style.display = "flex";
  });

  if (generateResumeButton) {
    generateResumeButton.addEventListener("click", () => {
      userNameText = username.value;
      if (userNameText === "") {
        alert("Input can't be empty");
      } else {
        searchUsernameContainer.style.display = "none";
        loadingIndicator.style.display = "flex";
        try {
          fetchUserData(userNameText);
          setTimeout(() => {
            generatedResume.style.display = "flex";
            downloadResumeButton.style.display = "flex";
          }, 6000);

          setTimeout(() => {
            loadingIndicator.style.display = "none";
          }, 6000);

        } catch (error) {
          console.error(error);
        }

      }
    });
  }

  if (downloadResumeButton) {
    downloadResumeButton.addEventListener("click", () => {
      try {
        if (!window.sharedData.email) {
          throw new Error("User email not found");
        }
        // Check email availability
        userEmail = window.sharedData.email;
        navBarVisibility.style.display = "none";
        downloadResumeButton.style.display = "none";
        downloadPDF(userNameText, userEmail);
      } catch (error) {
        console.error(error);
        alert("Failed to retrieve user email. Please try again.");
      }
    });
  }
});
