const userContactDetailsInputContainer = document.querySelector(
  ".userContactDetailsInputContainer"
);
const searchUsernameContainer = document.querySelector(
  ".searchUsernameContainer"
);
const userEmailInput = document.querySelector(".emailInput");
const userPhoneNoInput = document.querySelector(".phoneNoInput");
const getEmailAndPhoneNoButton = document.querySelector(
  ".continueToNextPageButton"
);

getEmailAndPhoneNoButton.addEventListener("click", () => {
  try {
    const userEmail = userEmailInput.value;
    const userPhoneNo = userPhoneNoInput.value;
   
    const emailCharactersCheck = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const validityOfMail =  emailCharactersCheck.test(String(userEmail).toLowerCase());
    

    if ( validityOfMail && (/^\d+$/.test(userPhoneNo))) {
      userContactDetailsInputContainer.style.display = "none";
      searchUsernameContainer.style.display = "flex";
      
      window.sharedData = {
        email: userEmail,
        phoneNo: userPhoneNo,
      };
    } else {
      alert("Please enter valid contact details");
    }
  } catch (error) {
    alert("Something went wrong");
    window.open("index.html","_self");
  }

});

