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
//Viewer consts, desktop / platform agnostic:
const VIEWER_COUNT_SIDEBAR = `Layout-sc-1xcs6mc-0 jOVwMQ`; //View counts on the sidebar when watching a stream
const CHANNEL_VIEWER_COUNT = `CoreText-sc-1txzju1-0 fiDbWi`; //Viewer count when watching a stream
const BROWSE_VIEW_COUNT = `ScCoreLink-sc-16kq0mq-0 dFpxxo tw-link`; //View count when browsing categories
const BROWSE_LIVE_VIEW_COUNT = `ScPositionCorner-sc-1shjvnv-1 kdSYzp`; //VOD view count, and view count for browsing live channels
const BROWSE_FEATURED_LIVE_VIEW_COUNT = `CoreText-sc-1txzju1-0 ZSApR`; //View count for when previewing a stream in a category
const BROWSE_LIST_VIEW_COUNT = `Layout-sc-1xcs6mc-0 duHgVC`; //View count when viewing live channels in a category
const VOD_LIVEWITH_COUNT = `Layout-sc-1xcs6mc-0 fVBKtH`; //View count that appears when viewing the VOD of a currently live channel
const CHANNEL_PAGE_VIEW_COUNT = `ScCoreLink-sc-16kq0mq-0 eFqEFL tw-link`; //"Watch now with [X] viewers" thing when looking at the about of a live channel
const VOD_VIEW_COUNT = `Layout-sc-1xcs6mc-0 fpvLcA`;
const MAIN_PAGE_FEATURED_STREAM = `Layout-sc-1xcs6mc-0 iBXVMz`;
//const VOD_VIEWCOUNT = `CoreText-sc-1txzju1-0 kCftaN`; //Unused; causes other elements to disappear

//Viewer consts, mobile only
const BROWSE_VIEW_COUNT_MOB = `CoreText-sc-1txzju1-0 iudvXF`;
const CHANNEL_PAGE_VIEW_COUNT_MOB = `CoreText-sc-1txzju1-0 frwLwh`;

//Channel Leaderboard consts
const MARQUEE_LEADERBOARD = `Layout-sc-1xcs6mc-0 gyHpt marquee-animation`; //Sliding element showing multiple people who have cheered / gifted
const CHANNEL_LEADERBOARD = `Layout-sc-1xcs6mc-0 hsXgFK`; //General channel leaderboard

//Follower / goal consts
const FOLLOWER_COUNT = `Layout-sc-1xcs6mc-0 jLsnDT`; //Follower count in about section
const FOLLOWERS_NAME = `CoreText-sc-1txzju1-0 cwNkcn`; //Follower count beneath account name
const VOD_FOLLOWER_COUNT = `Layout-sc-1xcs6mc-0 hfyuZP`; //VOD follower count
const SEARCH_FOLLOWER_COUNT_MOB = `Layout-sc-1xcs6mc-0 htiGKh`;
const CHANNEL_GOAL = `Layout-sc-1xcs6mc-0 fbcEIS`; //Channel goals

//Follower / Goal consts, mobile only
const FOLLOWERS_NAME_MOB = `Layout-sc-1xcs6mc-0 RGDEJ`;

//Browser keys array
const KEYS_ARR = ["viewersAll", "viewerCountSidebar", "channelViewerCount", "browseViewcount", "browseLiveViewCount", "browseFeaturedLiveViewCount", "browseListViewCount", "vodLivewithCount", "channelPageViewCount", "followerCount", "vodFollowerCount", "marqueeLeaderboard", "channelLeaderboard", "channelGoal", "vodViewCount", "mainPageFeaturedStream", "followerCountAboutMe" ]

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

async function removeElementWithAttribute(element_remove, attribute_type) {
	
	//Get all elements of class
	const viewcount_channel = document.getElementsByClassName(`${element_remove}`);
	
	//Make sure the const has anything in before we modify it!
	if(viewcount_channel !== null && viewcount_channel !== undefined){
		
		//Iterate over everything
		for(var i = 0; i < viewcount_channel.length; i++){
			
			//Check to make sure we're not trying to delete a null item, then delete!
			if(viewcount_channel[i] !== null && viewcount_channel[i].getAttribute(attribute_type))
				viewcount_channel[i].remove();
			
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

async function removeChildElement(element_remove, child_node_index) {
		
	//Get all elements of a class
	const viewcount_sidebar = document.getElementsByClassName(`${element_remove}`);
	
	//Make sure that the const actually has anything in it before we modify it!
	if(viewcount_sidebar !== null && viewcount_sidebar !== undefined){
		
		//Iterate over everything in the viewcount_sidebar const
		for(var i = 0; i < viewcount_sidebar.length; i++){				
			//Quickly check to make sure we're not null before we delete
			if(viewcount_sidebar[i].childNodes[child_node_index] !== null && viewcount_sidebar[i].childNodes[child_node_index] !== undefined)
				viewcount_sidebar[i].childNodes[child_node_index].remove();
		}
	}
}

async function setText(element_remove, inner_text) {
	//Get all elements of a class
	const viewcount_sidebar = document.getElementsByClassName(`${element_remove}`);
	
	//Make sure that the const actually has anything in it before we modify it!
	if(viewcount_sidebar !== null && viewcount_sidebar !== undefined){
		
		//Iterate over everything in the viewcount_sidebar const
		for(var i = 0; i < viewcount_sidebar.length; i++){				
			//Quickly check to make sure we're the both the correct element and not null before we modify.
			if(viewcount_sidebar[i] !== null && viewcount_sidebar[i].childNodes.length === 2) //Needs to be generalised, but I'm not doing that rn as it doesn't seem necessary
				viewcount_sidebar[i].textContent = inner_text;
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
	//First check to make sure that our browser preferences exist -- if the first one does, chances are the others do...
	var quick_test = await getBrowserStorage(KEYS_ARR[0]);
	if(quick_test === "undefined" || quick_test === undefined){
		
		//...if not, set them all to true, then fetch...
		for(var i = 0; i < PREF_ARR.length; i++){
			await chrome.storage.sync.set({[KEYS_ARR[i]]: true});
			PREF_ARR[i] = await getBrowserStorage(KEYS_ARR[i]);
		}
		
	} else {//...otherwise, just fetch our browser preferences on init, so that way when we're not wasting time async-ing everytime the DOM updates
		
		for(var i = 0; i < PREF_ARR.length; i++){
			PREF_ARR[i] = await getBrowserStorage(KEYS_ARR[i]);
		}
	}
}

//TODO: Create an array of all the storage keys, and create a for loop for this. 
const mutationCallback = async(mutations) => {
    mutations.forEach((mutation) => {
		let desktop = document.getElementsByClassName("Layout-sc-1xcs6mc-0 dMwWxt").length === 0;

		//This feels really bad, but I genuinely can't think of a better way to do this rn :<
		//So if someone else can come up with something better.. please do >-<;
		
		
		if(desktop){
			//Desktop only elements
			if(PREF_ARR[0] || PREF_ARR[1]){
				setText(VIEWER_COUNT_SIDEBAR, "Live");
			}
			if(PREF_ARR[0] || PREF_ARR[2]){
				removeElementParent();
			}
			if(PREF_ARR[0] || PREF_ARR[3]){
				removeElementWithAttribute(BROWSE_VIEW_COUNT, "data-a-target");
			}
			if(PREF_ARR[0] || PREF_ARR[5]){
				removeElementWithoutAttribute(BROWSE_FEATURED_LIVE_VIEW_COUNT, "style");
			}
			if(PREF_ARR[0] || PREF_ARR[7]){
				removeChildElement(VOD_LIVEWITH_COUNT, 1);
			}
			if(PREF_ARR[0] || PREF_ARR[8]){
				setTextWithAttribute(CHANNEL_PAGE_VIEW_COUNT, "Watch now!", "data-a-target", "home-live-overlay-button");
			}
			if(PREF_ARR[9]){
				removeElement(FOLLOWERS_NAME);
			}
		}else{
			//Mobile only elements
			if(PREF_ARR[0] || PREF_ARR[3]){
				removeElement(BROWSE_VIEW_COUNT_MOB)
			}
			if(PREF_ARR[0] || PREF_ARR[8]){
				removeChildElement(CHANNEL_PAGE_VIEW_COUNT_MOB, 1);
			}
			if(PREF_ARR[9]){
				removeElement(FOLLOWERS_NAME_MOB);
			}
			if(PREF_ARR[16]){
				
				let mob_search_followers_elements = document.getElementsByClassName(SEARCH_FOLLOWER_COUNT_MOB).length;
				
				if(mob_search_followers_elements > 3){
					removeChildElement(SEARCH_FOLLOWER_COUNT_MOB, 2);
					removeChildElement(SEARCH_FOLLOWER_COUNT_MOB, 1);
				}else if(mob_search_followers_elements > 2){
					removeChildElement(SEARCH_FOLLOWER_COUNT_MOB, 1);
				}
			}
			
		}
		
		//Platform agnostic settings
		if(PREF_ARR[0] || PREF_ARR[4]){
			removeElement(BROWSE_LIVE_VIEW_COUNT);
		}
		
		
		
		if(PREF_ARR[0] || PREF_ARR[6]){
			removeElement(BROWSE_LIST_VIEW_COUNT);
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
			removeElement(FOLLOWER_COUNT);
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