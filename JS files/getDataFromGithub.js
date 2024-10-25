import { Octokit } from "https://esm.sh/@octokit/rest";
import { GITHUB_AUTH_TOKEN } from "./constants.js";

const userNameAtResume = document.querySelector(".nameContainer");
const userContactDetailsToBeShown = document.querySelector(".contactContainer");
const projectDetailsToBeShown = document.querySelector(".projectOneContainer");
const userSkillsToBeShown = document.querySelector(".userSkills");

const octokit = new Octokit({
  auth: GITHUB_AUTH_TOKEN,
});

export const fetchUserData = async (username) => {
  try {
    // Ensure window.sharedData exists
    if (window.sharedData) {
      const { email: userEmail, phoneNo: userPhoneNo } = window.sharedData;

      // Fetch user data
      const { data: userData } = await octokit.rest.users.getByUsername({
        username,
      });

      // Display user's Name at resume
      userNameAtResume.innerHTML = `<h1 class="name">${userData.name}</h1>`;

      // Display contact details of user
      if (userData.twitter_username === null) {
        userContactDetailsToBeShown.innerHTML = `
        <div class="email">
        <a href="mailto:${userEmail}">${userEmail}</a></div>
        <div class="seperator">|</div>
        <div class="phoneNo">+91 ${userPhoneNo}</div>
        <div class="seperator">|</div>
        <div class="githubHandle">
        <a href="${userData.html_url}" target="_blank" rel="noopener noreferrer">${userData.html_url}</a></div>`;
      } else {
        userContactDetailsToBeShown.innerHTML = `
        <div class="email">
        <a href="mailto:${userEmail}">${userEmail}</a></div>
        <div class="seperator">|</div>
        <div class="phoneNo">+91 ${userPhoneNo}</div>
        <div class="seperator">|</div>
        <div class="githubHandle">
        <a href="${userData.html_url}" target="_blank" rel="noopener noreferrer">${userData.html_url}</a></div>
        <div class="seperator">|</div>
        <div class="twitterHandle">
        <a href="https://x.com/${userData.twitter_username}" target="_blank">https://x.com/${userData.twitter_username}</a></div>`;
      }

      //Get user's all repositories for skills section
      const { data: userReposForSkills } = await octokit.rest.repos.listForUser(
        {
          username,
          per_page: 100,
          page: 1,
        }
      );
      let allLanguages = new Set();
      let userSkillsArray = [];

      if (userReposForSkills.length === 0) {
        alert("You don't have any data to show");
        // window.location.reload();
        return;
      } else {
        //Traversing through user's each repo to get required languages used to built respective projects
        userReposForSkills.map(async (repo) => {
          //Fetching languages data from each repo
          const { data: repoLanguages } =
            await octokit.rest.repos.listLanguages({
              owner: username,
              repo: repo.name,
            });

          // Add each language to the Set (automatically handles uniqueness)
          Object.keys(repoLanguages).forEach((language) => {
            allLanguages.add(language);
          });
          userSkillsArray = Array.from(allLanguages); // Convert the Set to an array for easier display

          // Updating DOM with user's skills using join operator to show particular skill, e.g, Python | Java | JavaScript
          userSkillsToBeShown.innerHTML = userSkillsArray
            .map((skill, index) =>
              index === 0
                ? `<div class="skills">${skill}</div>`
                : `<div class="seperator">|</div>
       <div class="skills">${skill}</div>`
            )
            .join("");
        });

        // Get user's repositories for showing project details at projects section
        const { data: userRepos } = await octokit.rest.repos.listForUser({
          username,
          sort: "stargazers_count",
          direction: "desc",
          per_page: 3, // atmost 3 projects to be shown from entire repositories of user
        });

        // Fetch and display project details for each of total 3 repositories
        userRepos.map(async (Repo) => {
          const { data: repoLanguages } =
            await octokit.rest.repos.listLanguages({
              owner: username,
              repo: Repo.name,
            });

          // Updating the DOM for showing projects at resume
          projectDetailsToBeShown.innerHTML += `
          <h1 class="projectOneHeading">${Repo.name}</h1>
              <div class="projectOneDescriptionContainer">
                <p class="projectOneDescription">
                  ● ${
                    Repo.description ??
                    "This project utilizes a range of technologies including programming languages, frameworks, and tools to achieve its objectives."
                  }
                </p>
                <p class="techStackUsedProjectOne">
                  ● Built using ${Object.keys(repoLanguages).join(", ")}
                </p>
                <p class="projectOneLiveLink">
                  Link:
                    <a href="${Repo.html_url}" target="_blank">
                  <span class ="liveLink"> ${Repo.html_url} </span>
                  </a>
                </p>
              </div>`;
        });
      }
    } else {
      console.error("Email and phone no. not set");
    }
  } catch (error) {
    if (error.status === 404) {
      alert("User not found");
      window.location.reload();
    } else {
      alert("Something went wrong");
      window.location.reload();
    }
  }
};
