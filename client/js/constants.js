// ***********************
// Screen state constants.
// ***********************

// The splash screen, displayed when the game first loads.
var STATE_SPLASH = 0;

// The main menu.
var STATE_MAIN_MENU = 1;

// The credits screen.
var STATE_CREDITS = 2;

// The options screen.
var STATE_OPTIONS = 3;

// The tutorial screen.
//
// Although there are multiple pages for the tutorial,
// they are contained within the same screen and swapped
// out dynamically as the user switches between them.
var STATE_TUTORIAL = 4;

// The first page of the screen when the user is a host.
//
// This is the screen that allows the host to select how
// many players they want in their game.
var STATE_LOBBY_HOST_PREFS = 5;

// The lobby screen for the host.
var STATE_LOBBY_HOST = 6;

// The lobby screen for players who aren't a host.
var STATE_LOBBY_USER = 7;

// The countdown screen that displays when the game is
// about to begin.
var STATE_COUNTDOWN = 8;

// The main game.
var STATE_GAME = 9;

// The score screen that displays after the game.
var STATE_SCORE = 10;
