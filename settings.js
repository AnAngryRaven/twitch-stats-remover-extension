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
const VIEWERS_CHECKBOXES = document.getElementsByClassName("viewers-options");
const REPORT_ISSUE = document.getElementById("report-issue");
const MIT_LICENCE = document.getElementById("mit-licence");

//Browser keys array
const KEYS_ARR = ["viewersAll", "viewerCountSidebar", "channelViewerCount", "browseViewcount", "browseLiveViewCount", "browseLiveIndicator", "channelLiveIndicator", "vodLivewithCount", "channelPageViewCount", "followerCount", "vodFollowerCount", "combosButton", "channelLeaderboard", "channelGoal", "vodViewCount", "mainPageFeaturedStream", "followerCountAboutMe", "twitchconBannerAd", "subtemberBannerAd" ]

document.addEventListener("DOMContentLoaded", async (event) => {
	var firstInstall = await get("firstInstall");
	
	if(firstInstall === "undefined" || firstInstall === undefined){
		for(var i = 0; i < KEYS_ARR.length; i++){
			var currentVal = await get(KEYS_ARR[i]);
			if(currentVal === "undefined" || currentVal === undefined){
				if(i === 17 || i === 18){
					await chrome.storage.sync.set({[KEYS_ARR[i]]: false});
				}else{
					await chrome.storage.sync.set({[KEYS_ARR[i]]: true});
				}
				
				currentVal = await get(KEYS_ARR[i]);
			}
			document.getElementById(KEYS_ARR[i]).checked = currentVal;
		}
		chrome.storage.sync.set({"firstInstall": false});
	}else {
		let grouping = await get("groupSetting");
		if(grouping === "undefined" || grouping === undefined){
			await chrome.storage.sync.set({"groupSetting": "by-loc"})
			grouping = "by-loc";
		}
		await changeGrouping(grouping);
		await getKeys();
	}

	const VIEWERS_ENABLE_ALL = document.getElementById("viewersAll");
	const VIEWERS_SUMMARY = document.getElementById("viewers-summary");
	if(VIEWERS_ENABLE_ALL != null){
		VIEWERS_ENABLE_ALL.addEventListener("change", function() {
			let currentState = this.checked;

			if(currentState){
				for(var i = 0; i < VIEWERS_CHECKBOXES.length; i++){
					VIEWERS_CHECKBOXES[i].disabled = true;
					VIEWERS_SUMMARY.innerText = browser.i18n.getMessage("summary-all")
					VIEWERS_SUMMARY.parentElement.open = false;
				}
			}else{
				for(var i = 0; i < VIEWERS_CHECKBOXES.length; i++){
					VIEWERS_CHECKBOXES[i].disabled = false;
					VIEWERS_SUMMARY.innerText = browser.i18n.getMessage("summary-individual")
					VIEWERS_SUMMARY.parentElement.open = true;
				}
			}
		});
	}
	
});

async function getKeys() {
	for(var i = 0; i < KEYS_ARR.length; i++){
		var currentVal = await get(KEYS_ARR[i]);
		if(currentVal === "undefined" || currentVal === undefined){
			await chrome.storage.sync.set({[KEYS_ARR[i]]: false});

			currentVal = await get(KEYS_ARR[i]);
		}
		if(KEYS_ARR[i] === "RESERVED"){
			continue;
		}
		//console.log(document.getElementById(KEYS_ARR[i]));
		if(document.getElementById(KEYS_ARR[i]) != null){
			document.getElementById(KEYS_ARR[i]).checked = currentVal;
		}
		document.querySelectorAll('[data-loc]').forEach(elm => {
			elm.innerHTML = browser.i18n.getMessage(elm.dataset.loc);
		})
	}
}

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

//Bit weird this isn't included in the standard, I'll be honest..
document.querySelectorAll('[data-loc]').forEach(elm => {
	elm.innerHTML = browser.i18n.getMessage(elm.dataset.loc);
})

async function changeGrouping(type) {
	console.log(type);
	if(type === 1 || type === "by-feat") {
		document.getElementById("sort-interior").innerHTML = await (await fetch(chrome.runtime.getURL("by_feat.html"))).text();
		await chrome.storage.sync.set({"groupSetting": "by-feat"});
	}else {
		document.getElementById("sort-interior").innerHTML = await (await fetch(chrome.runtime.getURL("by_loc.html"))).text();
		await chrome.storage.sync.set({"groupSetting": "by-loc"});
	}
	getKeys();
}

document.getElementById("feature-grouping").addEventListener("change", async function() { await changeGrouping(document.getElementById("feature-grouping").selectedIndex); });

document.addEventListener("change", async function(event) {
	elm = event.target;
	
	for(var i = 0; i < KEYS_ARR.length; i++){
		if(elm.id === KEYS_ARR[i]){
			await chrome.storage.sync.set({[KEYS_ARR[i]]: elm.checked});
			break;
		}
	}
});
