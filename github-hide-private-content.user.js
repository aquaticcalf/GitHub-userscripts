// ==UserScript==
// @name        GitHub Hide Private Content
// @version     0.1.0
// @description A userscript that hides private repositories and organizations for screen sharing
// @license     MIT
// @author      Rob Garrison
// @namespace   https://github.com/Mottie
// @match       https://github.com/*
// @run-at      document-idle
// @grant       GM.addStyle
// @grant       GM_addStyle
// @require     https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js?updated=20180103
// @require     https://greasyfork.org/scripts/28721-mutations/code/mutations.js?version=1108163
// @icon        https://github.githubassets.com/pinned-octocat.svg
// @updateURL   https://raw.githubusercontent.com/Mottie/GitHub-userscripts/master/github-hide-private-content.user.js
// @downloadURL https://raw.githubusercontent.com/Mottie/GitHub-userscripts/master/github-hide-private-content.user.js
// @supportURL  https://github.com/Mottie/GitHub-userscripts/issues
// ==/UserScript==

(() => {
	"use strict";

	// Hide private repositories and organizations using CSS
	GM.addStyle(`
		/* Hide private repos in repository lists */
		[data-hovercard-type="repository"]:has([aria-label*="Private"]),
		.repo-list-item:has([aria-label*="Private"]),
		.Box-row:has([aria-label*="Private"]),
		li[itemprop="owns"]:has([aria-label*="Private"]),
		
		/* Hide private repos in search results */
		.repo-list-item:has(.Label--secondary:contains("Private")),
		
		/* Hide private organizations in profile sidebar */
		.border-top:has([aria-label*="Private organization"]),
		
		/* Hide private repos with lock icon */
		.d-flex:has(svg[aria-label*="Private"]),
		.position-relative:has(svg[aria-label*="Private"]),
		
		/* Hide repos with private label badge */
		.Label--secondary:contains("Private"),
		
		/* Hide pinned private repos */
		.pinned-item-list-item:has([title*="Private"]) {
			display: none !important;
		}
	`);

	function hidePrivateContent() {
		// Find all elements that indicate private content
		const privateIndicators = [
			// Repository lists
			"[aria-label*='Private']",
			"[title*='Private']",
			// Labels with "Private" text
			".Label--secondary"
		];

		privateIndicators.forEach(selector => {
			document.querySelectorAll(selector).forEach(el => {
				// Check if it's actually a private indicator
				const text = el.textContent || el.getAttribute("aria-label") || el.getAttribute("title");
				if (text && text.toLowerCase().includes("private")) {
					// Find the parent container to hide
					let parent = el.closest(".Box-row") ||
						el.closest(".repo-list-item") ||
						el.closest("li[itemprop='owns']") ||
						el.closest(".pinned-item-list-item") ||
						el.closest(".d-flex.flex-justify-between") ||
						el.closest("[data-hovercard-type='repository']");

					if (parent) {
						parent.style.display = "none";
					}
				}
			});
		});

		// Hide private organizations from profile sidebar
		document.querySelectorAll("a[data-hovercard-type='organization']").forEach(orgLink => {
			const ariaLabel = orgLink.getAttribute("aria-label");
			if (ariaLabel && ariaLabel.toLowerCase().includes("private")) {
				const parent = orgLink.closest(".border-top");
				if (parent) {
					parent.style.display = "none";
				}
			}
		});
	}

	// Run on initial load
	hidePrivateContent();

	// Re-run when DOM changes (for dynamic content)
	document.addEventListener("ghmo:container", hidePrivateContent);
	document.addEventListener("pjax:end", hidePrivateContent);

	// Use MutationObserver for additional dynamic content
	const observer = new MutationObserver(() => {
		hidePrivateContent();
	});

	observer.observe(document.body, {
		childList: true,
		subtree: true
	});
})();
