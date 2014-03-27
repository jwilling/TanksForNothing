// ***********************
// Screen state constants.
// ***********************

// The splash screen, displayed when the game first loads.
var STATE_SPLASH_SCREEN = me.state.USER + 0;

// The main menu.
var STATE_MAIN_MENU = me.state.USER + 1;

// The credits screen.
var STATE_CREDITS = me.state.USER + 2;

// The options screen.
var STATE_OPTIONS = me.state.USER + 3;

// The tutorial screen.
//
// Although there are multiple pages for the tutorial,
// they are contained within the same screen and swapped
// out dynamically as the user switches between them.
var STATE_TUTORIAL = me.state.USER + 4;

// The first page of the screen when the user is a host.
//
// This is the screen that allows the host to select how
// many players they want in their game.
var STATE_LOBBY_HOST_PREFS = me.state.USER + 5;

// The lobby screen for the host.
var STATE_LOBBY_HOST = me.state.USER + 6;

// The lobby screen for players who aren't a host.
var STATE_LOBBY_USER = me.state.USER + 7;

// The countdown screen that displays when the game is
// about to begin.
var STATE_COUNTDOWN = me.state.USER + 8;

// The main game.
var STATE_GAME = me.state.USER + 9;

// The score screen that displays after the game.
var STATE_SCORE = me.state.USER + 10;
