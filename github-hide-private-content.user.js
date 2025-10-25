// ==UserScript==
// @name        GitHub Hide Private Content
// @version     0.0.1
// @description A userscript that hides private repositories and organizations for screen sharing
// @license     MIT
// @author      aquaticcalf
// @namespace   https://github.com/aquaticcalf
// @match       https://github.com/*
// @run-at      document-idle
// @grant       none
// @require     https://greasyfork.org/scripts/28721-mutations/code/mutations.js?version=1108163
// @icon        https://github.githubassets.com/pinned-octocat.svg
// @updateURL   https://raw.githubusercontent.com/aquaticcalf/GitHub-userscripts/master/github-hide-private-content.user.js
// @downloadURL https://raw.githubusercontent.com/aquaticcalf/GitHub-userscripts/master/github-hide-private-content.user.js
// @supportURL  https://github.com/aquaticcalf/GitHub-userscripts/issues
// ==/UserScript==

(() => {
	"use strict";

	function hidePrivateContent() {
		// Hide private repositories - look for lock icon with "Private" label
		document.querySelectorAll("svg[aria-label='Private']").forEach(lockIcon => {
			// Find the repository container
			const repoContainer = lockIcon.closest("li") ||
				lockIcon.closest(".Box-row") ||
				lockIcon.closest(".pinned-item-list-item") ||
				lockIcon.closest("[data-hovercard-type='repository']");

			if (repoContainer) {
				repoContainer.style.display = "none";
			}
		});

		// Hide "Private" label badges
		document.querySelectorAll(".Label--secondary").forEach(label => {
			if (label.textContent.trim() === "Private") {
				const repoContainer = label.closest("li") ||
					label.closest(".Box-row") ||
					label.closest(".repo-list-item") ||
					label.closest(".pinned-item-list-item");

				if (repoContainer) {
					repoContainer.style.display = "none";
				}
			}
		});

		// Hide private organizations from profile sidebar
		document.querySelectorAll("a[data-hovercard-type='organization']").forEach(orgLink => {
			const ariaLabel = orgLink.getAttribute("aria-label");
			if (ariaLabel && ariaLabel.toLowerCase().includes("private")) {
				const orgContainer = orgLink.closest(".border-top") || orgLink.closest("a");
				if (orgContainer) {
					orgContainer.style.display = "none";
				}
			}
		});
	}

	// Run on initial load
	hidePrivateContent();

	// Re-run when DOM changes (for dynamic content)
	document.addEventListener("ghmo:container", hidePrivateContent);
	document.addEventListener("pjax:end", hidePrivateContent);
})();
