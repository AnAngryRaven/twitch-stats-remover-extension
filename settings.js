/**
	Copyright 2024 AnAngryRaven
	
	Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
	documentation files (the “Software”), to deal in the Software without restriction, including without limitation
	the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
	to permit persons to whom the Software is furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all copies or substantial portions of
	the Software.

	THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
	THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
	TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
**/
const VIEWERS_ENABLE_ALL = document.getElementById("viewersAll");
const VIEWERS_CHECKBOXES = document.getElementsByClassName("viewers-options");
const VIEWERS_SUMMARY = document.getElementById("viewers-summary");
const REPORT_ISSUE = document.getElementById("report-issue");
const MIT_LICENCE = document.getElementById("mit-licence");

//Browser keys array
const KEYS_ARR = ["viewersAll", "viewerCountSidebar", "channelViewerCount", "browseViewcount", "browseLiveViewCount", "browseFeaturedLiveViewCount", "browseListViewCount", "vodLivewithCount", "channelPageViewCount", "followerCount", "vodFollowerCount", "marqueeLeaderboard", "channelLeaderboard", "channelGoal", "vodViewCount", "mainPageFeaturedStream", "followerCountAboutMe" ]

document.addEventListener("DOMContentLoaded", async (event) => {
	
	for(var i = 0; i < KEYS_ARR.length; i++){
		var currentVal = await get(KEYS_ARR[i]);
		if(currentVal === "undefined" || currentVal === undefined){
			await chrome.storage.sync.set({[KEYS_ARR[i]]: true});
			currentVal = await get(KEYS_ARR[i]);
		}
		document.getElementById(KEYS_ARR[i]).checked = currentVal;
		
		
	}
});

async function get(name){
	return await chrome.storage.sync.get(name).then(result => {
		return result[name];
	});
}

function onGot(item){
	return item.viewersAll;
}

function onError(err) {
	console.log("Error: ${err}");
}

VIEWERS_ENABLE_ALL.addEventListener("change", function() {
	let currentState = this.checked;
	
	if(currentState){
		for(var i = 0; i < VIEWERS_CHECKBOXES.length; i++){
			VIEWERS_CHECKBOXES[i].disabled = true;
			VIEWERS_SUMMARY.innerText = "All settings enabled!"
			VIEWERS_SUMMARY.parentElement.open = false;
		}
	}else{
		for(var i = 0; i < VIEWERS_CHECKBOXES.length; i++){
			VIEWERS_CHECKBOXES[i].disabled = false;
			VIEWERS_SUMMARY.innerText = "Individual settings used!"
			VIEWERS_SUMMARY.parentElement.open = true;
		}
	}
});

//Only exists for browser compatibility -- for some reason, Chrome doesn't open links clicked in an extension's popup in a new tab :p
try{
	browser.storage.sync.get();
}catch {
	REPORT_ISSUE.addEventListener("click", function() {
		window.open("https://github.com/AnAngryraven/twitch-stats-remover-extension");
	});

	MIT_LICENCE.addEventListener("click", function() {
		window.open("https://opensource.org/license/mit");
	});
}


document.addEventListener("change", async function(event) {
	elm = event.target;
	
	for(var i = 0; i < KEYS_ARR.length; i++){
		if(elm.id === KEYS_ARR[i]){
			await chrome.storage.sync.set({[KEYS_ARR[i]]: elm.checked});
			break;
		}
	}
});