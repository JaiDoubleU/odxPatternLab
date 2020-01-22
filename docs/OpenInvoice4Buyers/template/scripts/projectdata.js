// Publish project specific data
(function() {
rh = window.rh;
model = rh.model;

rh.consts('DEFAULT_TOPIC', encodeURI("#OpenInvoiceForBuyers_master/OI_MasterAdminUserGuide_TitlePage/OI_MasterAdminUserGuide_TitlePage.htm".substring(1)));
rh.consts('HOME_FILEPATH', encodeURI("index.html"));
rh.consts('START_FILEPATH', encodeURI('index.html'));
rh.consts('HELP_ID', 'B1C34983-8DDA-4050-AA67-6CDB9B8BEA73' || 'preview');
rh.consts('LNG_STOP_WORDS', ["a", "about", "after", "against", "all", "also", "among", "an", "and", "are", "as", "at", "be", "became", "because", "been", "between", "but", "by", "can", "come", "do", "during", "each", "early", "for", "form", "found", "from", "had", "has", "have", "he", "her", "his", "however", "in", "include", "into", "is", "it", "its", "late", "later", "made", "many", "may", "me", "med", "more", "most", "near", "no", "non", "not", "of", "on", "only", "or", "other", "over", "several", "she", "some", "such", "than", "that", "the", "their", "then", "there", "these", "they", "this", "through", "to", "under", "until", "use", "was", "we", "were", "when", "where", "which", "who", "with", "you"]);
rh.consts('LNG_SUBSTR_SEARCH', 1);

model.publish(rh.consts('KEY_DIR'), "ltr");
model.publish(rh.consts('KEY_LNG_NAME'), "en_US");
model.publish(rh.consts('KEY_LNG'), {"SearchResultsPerScreen":"Search results per page","Reset":"Reset","SyncToc":"SyncToc","HomeButton":"Home","WebSearchButton":"WebSearch","Welcome_header":"Welcome to our Help Center","HighlightSearchResults":"Highlight Search Results","GlossaryFilterTerms":"Filter Term","ApplyTip":"Apply","WebSearch":"WebSearch","Show":"Show","Welcome_text":"What can we help you with today?","ShowAll":"All","EnableAndSearch":"Display results with all search words","Next":"Next","Print":"Print","PreviousLabel":"Previous","NoScriptErrorMsg":"Enable JavaScript support in the browser to view this page.","Search":"-Search-","Hide":"Hide","Contents":"Contents","ShowHide":"Show/Hide","Canceled":"Canceled","favoritesLabel":"Favorites","Loading":"Loading...","EndOfResults":"End of search results.","SidebarToggleTip":"Expand/Collapse","Logo":"Logo","ContentFilterChanged":"Content filter is changed, search again","Logo/Author":"Powered By","JS_alert_LoadXmlFailed":"Failed to load XML file","favoritesNameLabel":"Name","Searching":"Searching...","SearchTitle":"Search","Copyright":"© Copyright 2018. All rights reserved.","Disabled Next":">>","unsetAsFavorite":"Unset as favorite","nofavoritesFound":"You have not marked any pages as favorite.","JS_alert_InitDatabaseFailed":"Failed to initialize database","Cancel":"Cancel","UnknownError":"Unknown error","ResultsFoundText":"%1 result(s) found for %2","FilterIntro":"Please select your filter(s):","Seperate":"|","Index":"Index","setAsFavorites":"Add to Favorites","setAsFavorite":"Set as favorite","TopicsNotFound":"No results found","SearchPageTitle":"Search Results","Glossary":"Glossary","SearchButtonTitle":"Search for...","Filter":"Filter","TableOfContents":"Table of Contents","NextLabel":"Next","HideAll":"Hide All","Disabled Prev":"<<","SearchOptions":"Search Options","Back":"Back","Prev":"Previous","ToTopTip":"Go to top","ShowTopicInContext":"Click here to see this page in full context","NavTip":"Menu","JS_alert_InvalidExpression_1":"The search string you typed is not valid.","IndexFilterKewords":"Filter Keyword","IeCompatibilityErrorMsg":"This page cannot be viewed in Internet Explorer 8 or earlier version.","FavoriteBoxTitle":"Favorites"});

model.publish(rh.consts('KEY_HEADER_DEFAULT_TITLE_COLOR'), "#ffffff");
model.publish(rh.consts('KEY_HEADER_DEFAULT_BACKGROUND_COLOR'), "#025172");
model.publish(rh.consts('KEY_LAYOUT_DEFAULT_FONT_FAMILY'), "\"Trebuchet MS\", Arial, sans-serif");

model.publish(rh.consts('KEY_HEADER_TITLE'), "OpenInvoice for Buyers");
model.publish(rh.consts('KEY_HEADER_TITLE_COLOR'), "#ffffff");
model.publish(rh.consts('KEY_HEADER_BACKGROUND_COLOR'), "#005CB8");
model.publish(rh.consts('KEY_HEADER_LOGO_PATH'), "template/azure_blueResponsive_HTML5/logo.png");
model.publish(rh.consts('KEY_LAYOUT_FONT_FAMILY'), "\"Trebuchet MS\", Arial, sans-serif");
model.publish(rh.consts('KEY_HEADER_HTML'), "<div class='topic-header' onClick='rh._.goToFullLayout()'>\
  <div class='logo'>\
    <img src='#{logo}' />\
  </div>\
  <div class='nav'>\
    <div class='title' title='#{title}'>\
      <span>#{title}</span>\
    </div>\
    <div class='gotohome' title='#{tooltip}'>\
      <span>#{label}</span>\
    </div></div>\
  </div>\
<div class='topic-header-shadow'></div>\
");
model.publish(rh.consts('KEY_HEADER_CSS'), ".topic-header { background-color: #{background-color}; color: #{color}; width: calc(100%); height: 3em; position: fixed; left: 0; top: 0; font-family: #{font-family}; display: table; box-sizing: border-box; }\
.topic-header-shadow { height: 3em; width: 100%; }\
.logo { cursor: pointer; padding: 0.2em; text-align: center; display: table-cell; vertical-align: middle; }\
.logo img { width: 1.875em; display: block; }\
.nav { width: 100%; display: table-cell; }\
.title { width: 40%; height: 100%; float: left; line-height: 3em; cursor: pointer; }\
.gotohome { width: 60%; float: left; text-align: right; height: 100%; line-height: 3em; cursor: pointer; }\
.title span, .gotohome span { padding: 0em 1em; white-space: nowrap; text-overflow: ellipsis; overflow: hidden; display: block; }");

})();