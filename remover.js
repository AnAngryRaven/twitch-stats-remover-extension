/**

	Some notes:
	At best, I'm an amateur coder. Combined with the fact that I don't have the most experience in JavaScript,
	it likely means that this code isn't optimized as well or perhaps even done the "proper" way. By all means,
	if you see a way to optimize it / just generally make it better, feel free to contribute to the GitHub repo!
	
	Additionally, if there are any unintended consequences to the simple approach I've taken here (I'm basically
	just blanket deleting objects of a certain class after all!) open an issue on GitHub, and I'll take a look
	at it.
	
	(I'm sure I should take a much more.. refined approach, but truth be told I'm just quickly throwing this
	together right now so :P )
**/
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
//Viewer consts:
const VIEWER_COUNT_SIDEBAR = `Layout-sc-1xcs6mc-0 jOVwMQ`; //View counts on the sidebar when watching a stream
const CHANNEL_VIEWER_COUNT = `CoreText-sc-1txzju1-0 fiDbWi`; //Viewer count when watching a stream
const BROWSE_VIEW_COUNT = `ScCoreLink-sc-16kq0mq-0 dFpxxo tw-link`; //View count when browsing categories
const BROWSE_LIVE_VIEW_COUNT = `ScPositionCorner-sc-1shjvnv-1 kdSYzp`; //VOD view count, and view count for browsing live channels
const BROWSE_FEATURED_LIVE_VIEW_COUNT = `CoreText-sc-1txzju1-0 ZSApR`; //View count for when previewing a stream in a category
const BROWSE_LIST_VIEW_COUNT = `Layout-sc-1xcs6mc-0 duHgVC`; //View count when viewing live channels in a category
const VOD_LIVEWITH_COUNT = `Layout-sc-1xcs6mc-0 fVBKtH`; //View count that appears when viewing the VOD of a currently live channel
const CHANNEL_PAGE_VIEW_COUNT = `ScCoreLink-sc-16kq0mq-0 hcWFnG tw-link`; //"Watch now with [X] viewers" thing when looking at the about of a live channel
const VOD_VIEW_COUNT = `Layout-sc-1xcs6mc-0 fpvLcA`;
const MAIN_PAGE_FEATURED_STREAM = `Layout-sc-1xcs6mc-0 iBXVMz`;
const SEARCH_ALSO_VIEW_VIEWCOUNT = `ScTextWrapper-sc-10mto54-1 REkcH`;
const SEARCH_VIEWCOUNT = `CoreText-sc-1txzju1-0 MveHm`;
const SEARCH_VOD_VIEWCOUNT = `Layout-sc-1xcs6mc-0 hxGXwG`;
const HOST_OTHER_CHANNEL_CATEGORY = `Layout-sc-1xcs6mc-0 iNkiyZ`; //Removes the category and viewership numbers from the 
const HOST_WATCH_LINK = `CoreText-sc-1txzju1-0 dJFluO`;
const TAGGED_TITLE_USER_FOLLOWERS = `Layout-sc-1xcs6mc-0 fCJgZU`;
const TAGGED_TITLE_USER_VIEWERS = `CoreText-sc-1txzju1-0 kzJbuj`;
const STREAM_TOGETHER_VIEWCOUNT = `CoreText-sc-1txzju1-0 ctJVnB`;
//const VOD_VIEWCOUNT = `CoreText-sc-1txzju1-0 kCftaN`; //Unused; causes other elements to disappear

//Channel Leaderboard consts
const MARQUEE_LEADERBOARD = `Layout-sc-1xcs6mc-0 gyHpt marquee-animation`; //Sliding element showing multiple people who have cheered / gifted
const CHANNEL_LEADERBOARD = `Layout-sc-1xcs6mc-0 hsXgFK`; //General channel leaderboard

//Follower / goal consts
const FOLLOWER_COUNT = `Layout-sc-1xcs6mc-0 jLsnDT`; //Follower count in about section
const FOLLOWERS_NAME = `CoreText-sc-1txzju1-0 cwNkcn`; //Follower count beneath account name
const VOD_FOLLOWER_COUNT = `Layout-sc-1xcs6mc-0 hfyuZP`; //VOD follower count
const CHANNEL_GOAL = `Layout-sc-1xcs6mc-0 fbcEIS`; //Channel goals
const SEARCH_FOLLOWER_COUNT = `CoreText-sc-1txzju1-0 fHETfp`;

//Banner advertisements
const TWITCHCON_BANNER_ADVERTISEMENT = `tc-upsell`;
const SUBTEMBER_BANNER_ADVERTISEMENT = `subtember-gradient`;

//Browser keys array
const KEYS_ARR = ["viewersAll", "viewerCountSidebar", "channelViewerCount", "browseViewcount", "browseLiveViewCount", "browseFeaturedLiveViewCount", "browseListViewCount", "vodLivewithCount", "channelPageViewCount", "followerCount", "vodFollowerCount", "marqueeLeaderboard", "channelLeaderboard", "channelGoal", "vodViewCount", "mainPageFeaturedStream", "followerCountAboutMe", "twitchconBannerAd", "subtemberBannerAd" ]

//Preferences array; essentially caches our options so we don't have to be fetching them every time the DOM updates
var PREF_ARR = new Array(KEYS_ARR.length);

const ROOT = `.tw-root--hover`;

//TODO: Remove all of the "document.getElementsByClassName(`${element_remove}`)" and replace them with a function that does this and returns the value; It's unnecessarily repeating code

/**Used for many things, including but not limited to:
	- Sidebar view counts
	- Marquee leaderboard
	- Channel leaderboard proper
**/

async function removeElement(element_remove) {
		
	//Get all elements of a class
	const viewcount_sidebar = document.getElementsByClassName(`${element_remove}`);
	
	//Make sure that the const actually has anything in it before we modify it!
	if(viewcount_sidebar !== null && viewcount_sidebar !== undefined){
		
		//Iterate over everything in the viewcount_sidebar const
		for(var i = 0; i < viewcount_sidebar.length; i++){				
			//Quickly check to make sure we're not null before we delete
			if(viewcount_sidebar[i] !== null)
				viewcount_sidebar[i].remove();
		}
	}
}

/** Used mainly for the channel view count
	This has to be used as the class for the parent of this element is used elsewhere, so there's.. unintended
	consequences lol
	
	Works basically the same as the removeElement() function, just grabs the parentElement instead.
**/
async function removeElementParent() {
	
	//Get all elements of class
	const viewcount_channel = document.getElementsByClassName(`${CHANNEL_VIEWER_COUNT}`);
	
	//Make sure the const has anything in before we modify it!
	if(viewcount_channel !== null && viewcount_channel !== undefined){
		
		//Iterate over everything
		for(var i = 0; i < viewcount_channel.length; i++){
			
			//Check to make sure we're not trying to delete a null item, then delete!
			if(viewcount_channel[i].parentElement !== null)
				viewcount_channel[i].parentElement.remove();
			
		}
	}
}

async function removeElementWithoutAttribute(element_remove, attribute_type) {
	
	//Get all elements of class
	const viewcount_channel = document.getElementsByClassName(`${element_remove}`);
	
	//Make sure the const has anything in before we modify it!
	if(viewcount_channel !== null && viewcount_channel !== undefined){
		
		//Iterate over everything
		for(var i = 0; i < viewcount_channel.length; i++){
			
			//Check to make sure we're not trying to delete a null item, then delete!
			if(viewcount_channel[i] !== null && viewcount_channel[i].getAttribute(attribute_type) === null)
				viewcount_channel[i].remove();
			
		}
	}
}

async function removeElementWithAttribute(element_remove, attribute_type, attribute_text = "none") {
	
	//Get all elements of class
	const viewcount_channel = document.getElementsByClassName(`${element_remove}`);
	
	//Make sure the const has anything in before we modify it! Also, check to see if we're checking for specific attribute text.
	if(viewcount_channel !== null && viewcount_channel !== undefined && attribute_text === "none"){
		
		//Iterate over everything
		for(var i = 0; i < viewcount_channel.length; i++){
			
			//Check to make sure we're not trying to delete a null item, then delete!
			if(viewcount_channel[i] !== null && viewcount_channel[i].getAttribute(attribute_type)){
				viewcount_channel[i].remove();
			}
			
		}
	}else if(viewcount_channel !== null && viewcount_channel !== undefined && attribute_text !== "none"){
		//Iterate over everything
		for(var i = 0; i < viewcount_channel.length; i++){
			
			//Check to make sure we're not trying to delete a null item, then delete!
			if(viewcount_channel[i] !== null && viewcount_channel[i].getAttribute(attribute_type) === attribute_text){
				viewcount_channel[i].remove();
			}
			
		}
	}
}

async function removeElementChild(element_remove) {
		
	//Get all elements of a class
	const viewcount_sidebar = document.getElementsByClassName(`${element_remove}`);
	
	//Make sure that the const actually has anything in it before we modify it!
	if(viewcount_sidebar !== null && viewcount_sidebar !== undefined){
		
		//Iterate over everything in the viewcount_sidebar const
		for(var i = 0; i < viewcount_sidebar.length; i++){				
			//Quickly check to make sure we're not null before we delete
			if(viewcount_sidebar[i] !== null)
				viewcount_sidebar[i].remove();
		}
	}
}

function checkExistence(elm) {
	if(elm !== null && elm !== undefined){
		return true;
	}
	return false;
}

async function removeElmText(element_class){
	const elms = document.getElementsByClassName(`${element_class}`);
	if(checkExistence(elms)){
		for(var i = 0; i < elms.length; i++){
			var lastElm = elms[i].childNodes[elms[i].childNodes.length - 1];
			if(checkExistence(lastElm) && lastElm.className === undefined)
				lastElm.remove();
		}
	}
}

async function removeChildElement(element_remove, child_node_index, child_count = -1) {
		
	//Get all elements of a class
	const elms = document.getElementsByClassName(`${element_remove}`);
	
	//Make sure that any elements with specified class exist first
	if(checkExistence(elms)){
		
		//If no child_count has been specified...
		if(child_count === -1){
			
			//...iterate over everything in the elms const...
			for(var i = 0; i < elms.length; i++){				
				//...then quickly check to make sure we're not null before we delete...
				if(checkExistence(elms[i].childNodes[child_node_index]))
					elms[i].childNodes[child_node_index].remove();
			}
		}else{
			//...iterate over everything in the elms const
			for(var i = 0; i < elms.length; i++){				
				//Quickly check to make sure we're not null before we delete
				if(checkExistence(elms[i].childNodes[child_node_index]) && elms[i].childNodes.length === child_count)
					elms[i].childNodes[child_node_index].remove();
			}
		}
	}
}

function getChildElement(element_parent, child_node_index, child_count = -1) {
	//Get all elements of a class
	const elms = document.getElementsByClassName(`${element_parent}`);
	
	//Make sure that any elements with specified class exist first
	if(checkExistence(elms)){
		
		//If no child_count has been specified...
		if(child_count === -1){
			
			//...iterate over everything in the elms const...
			for(var i = 0; i < elms.length; i++){				
				//...then quickly check to make sure we're not null before we delete...
				if(checkExistence(elms[i].childNodes[child_node_index]))
					return elms[i].childNodes[child_node_index];
			}
		}else{
			//...iterate over everything in the elms const
			for(var i = 0; i < elms.length; i++){				
				//Quickly check to make sure we're not null before we delete
				if(checkExistence(elms[i].childNodes[child_node_index]) && elms[i].childNodes.length === child_count)
					return elms[i].childNodes[child_node_index];
			}
		}
	}
}

async function setText(element_remove, inner_text, child_count = 0) {
	//Get all elements of a class
	const elms = document.getElementsByClassName(`${element_remove}`);
	
	//Make sure that the const actually has anything in it before we modify it!
	if(checkExistence(elms)){
		
		//Iterate over everything in the elms const
		for(var i = 0; i < elms.length; i++){				
			//Quickly check to make sure we're the both the correct element and not null before we modify.
			if(elms[i] !== null && elms[i].childNodes.length === child_count) //Generalised and for what.
				elms[i].textContent = inner_text;
		}
	}
}

async function setTextWithAttribute(element_remove, inner_text, attribute_type, attribute_name) {
	
	//Get all elements of a class
	const viewcount_sidebar = document.getElementsByClassName(`${element_remove}`);
	
	//Make sure that the const actually has anything in it before we modify it!
	if(viewcount_sidebar !== null && viewcount_sidebar !== undefined){
		//Iterate over everything in the viewcount_sidebar const
		for(var i = 0; i < viewcount_sidebar.length; i++){				
			//Quickly check to make sure we're not null before we delete
			if(viewcount_sidebar[i].getAttribute(attribute_type) === attribute_name){
				viewcount_sidebar[i].textContent = inner_text;
				viewcount_sidebar[i].setAttribute(attribute_type, "");
			}
				
		}
	}
}

//Delete element with specific number of children
async function checkChildrenCount(elm, child_count) {
	//const elm = document.getElementsByClassName(`${element_check}`);
	var entries = [];

	for(var i = 0; i < elm.length; i++){
		if(elm[i].childNodes !== undefined && elm[i].childNodes !== null){
			if(elm[i].childNodes.length === child_count)
				elm[i].remove();
		}
	}
}

function getElements(elm_class){
	return document.getElementsByClassName(`${elm_class}`);
}

function onGot(item){
	return item.viewersAll;
}

function onError(err) {
	console.log("Error: ${err}");
}

async function getBrowserStorage(name){
	var val = await chrome.storage.sync.get(name).then(result => {
		return result[name];
	});
	return val;
}

async function fetchPreferences() {
	/*
	(Note that this automatically *disables* new features by default. This is intentional behaviour, as we don't know
	if a pre-existing user necessarily wants the new feature enabled. This can be switched in the future, should there
	be a desire to do so)
	*/
	var firstInstall = await getBrowserStorage("firstInstall");
	
	if(firstInstall === "undefined" || firstInstall === undefined){
		for(var i = 0; i < KEYS_ARR.length; i++){
			var currentVal = await getBrowserStorage(KEYS_ARR[i]);
			if(currentVal === "undefined" || currentVal === undefined){
				if(i === 17 || i === 18){
					await chrome.storage.sync.set({[KEYS_ARR[i]]: false});
				}else{
					await chrome.storage.sync.set({[KEYS_ARR[i]]: true});
				}
				
				currentVal = await getBrowserStorage(KEYS_ARR[i]);
			}
			PREF_ARR[i] = currentVal;
		}
		chrome.storage.sync.set({"firstInstall": false});
	}else {
		for(var i = 0; i < KEYS_ARR.length; i++){
			var currentVal = await getBrowserStorage(KEYS_ARR[i]);
			if(currentVal === "undefined" || currentVal === undefined){
				await chrome.storage.sync.set({[KEYS_ARR[i]]: false});
				
				currentVal = await getBrowserStorage(KEYS_ARR[i]);
			}
			PREF_ARR[i] = currentVal;
		}
	}
}

async function setTextStreamTogether(classname){
	const elms = getElements(classname);
	if(checkExistence(elms)){

		//Iterate over everything in the elms const
		for(var i = 0; i < elms.length; i++){				
			//Quickly check to make sure we're the both the correct element and not null before we modify.
			if(elms[i] !== null)
				elms[i].childNodes[0].nodeValue = "Live";
		}
	}
}

//TODO: Create an array of all the storage keys, and create a for loop for this. 
const mutationCallback = async(mutations) => {
    mutations.forEach((mutation) => {

		//This feels really bad, but I genuinely can't think of a better way to do this rn :<
		//So if someone else can come up with something better.. please do >-<;
		if(PREF_ARR[0] || PREF_ARR[1]){
			setText(VIEWER_COUNT_SIDEBAR, "Live", 2);
		}
		if(PREF_ARR[0] || PREF_ARR[2]){
			
			removeElementParent();
		}
		if(PREF_ARR[0] || PREF_ARR[3]){
			removeElementWithAttribute(BROWSE_VIEW_COUNT, "data-a-target");
		}
		if(PREF_ARR[0] || PREF_ARR[4]){
			removeElement(BROWSE_LIVE_VIEW_COUNT);
			removeElmText(SEARCH_ALSO_VIEW_VIEWCOUNT);
			removeElementWithAttribute(SEARCH_VIEWCOUNT, "data-test-selector", "search-result-live-channel__viewer-count");
			removeElementWithAttribute(SEARCH_VIEWCOUNT, "data-test-selector", "search-result-category__viewer-count");
			removeChildElement(SEARCH_VOD_VIEWCOUNT, 3, 6);
			removeChildElement(SEARCH_VOD_VIEWCOUNT, 3, 5);
			removeChildElement(TAGGED_TITLE_USER_VIEWERS, 3);
			for(var i = 0; i < (elm = getElements(TAGGED_TITLE_USER_FOLLOWERS)).length; i++){
				if(elm[i].childNodes[0].className == `CoreText-sc-1txzju1-0 iFvAnD InjectLayout-sc-1i43xsx-0 fxviYd`){
					elm[i].remove();
				}
			}
			setTextStreamTogether(STREAM_TOGETHER_VIEWCOUNT);
		}
		if(PREF_ARR[0] || PREF_ARR[5]){
			removeElementWithoutAttribute(BROWSE_FEATURED_LIVE_VIEW_COUNT, "style");
		}
		if(PREF_ARR[0] || PREF_ARR[6]){
			removeElement(BROWSE_LIST_VIEW_COUNT);
		}
		if(PREF_ARR[0] || PREF_ARR[7]){
			removeChildElement(VOD_LIVEWITH_COUNT, 1);
		}
		if(PREF_ARR[0] || PREF_ARR[8]){
			setTextWithAttribute(CHANNEL_PAGE_VIEW_COUNT, "Watch now!", "data-a-target", "home-live-overlay-button");
			removeChildElement(HOST_OTHER_CHANNEL_CATEGORY, 3, 4);
			if (getChildElement(HOST_WATCH_LINK, 0) != undefined)
				getChildElement(HOST_WATCH_LINK, 0).childNodes[0].childNodes[0].textContent = "Watch now!";
		}
		if(PREF_ARR[9]){
			removeElement(FOLLOWERS_NAME);
			removeElement(SEARCH_FOLLOWER_COUNT);
		}
		if(PREF_ARR[10]){
			removeChildElement(VOD_FOLLOWER_COUNT, 1);
		}
		if(PREF_ARR[11]){
			removeElement(MARQUEE_LEADERBOARD);
		}
		if(PREF_ARR[12]){
			checkChildrenCount(getElements(CHANNEL_LEADERBOARD), 3);
		}
		if(PREF_ARR[13]){
			removeElement(CHANNEL_GOAL);
		}
		if(PREF_ARR[0] || PREF_ARR[14]){
			removeChildElement(VOD_VIEW_COUNT, 2);
		}
		if(PREF_ARR[0] || PREF_ARR[15]){
			removeChildElement(MAIN_PAGE_FEATURED_STREAM, 2);
		}
		if(PREF_ARR[16]){
			const childElm = getChildElement(FOLLOWER_COUNT, 0);
			const elm = getElements(FOLLOWER_COUNT)[0];

			if(checkExistence(elm) && checkExistence(childElm)){
				if(elm.childNodes.length == 3){
					removeChildElement(FOLLOWER_COUNT, 0, 3);
					removeChildElement(FOLLOWER_COUNT, 0, 2); //Will need to be changed to 1 and 3 respectively when refactored to hide as opposed to remove. Because y'know, they'll be hidden and not removed.
				}else if(elm.childNodes.length == 1 && childElm.childNodes[0].className == `CoreText-sc-1txzju1-0 iFvAnD InjectLayout-sc-1i43xsx-0 fxviYd`){
					removeChildElement(FOLLOWER_COUNT, 0);
				}
			}
		}
		if(PREF_ARR[17]){
			removeElement(TWITCHCON_BANNER_ADVERTISEMENT);
		}
		if(PREF_ARR[18]) {
			removeElement(SUBTEMBER_BANNER_ADVERTISEMENT);
		}
    });
	
};
async function init() {
	const elm = document.querySelector(ROOT);
	if (elm === null) {
        setTimeout(init, 1000);
        return;
    }
	
	fetchPreferences();
	
	const observer = new MutationObserver(mutationCallback);
    const config = { childList: true, subtree: true };
    observer.observe(elm, config);
}
init();
