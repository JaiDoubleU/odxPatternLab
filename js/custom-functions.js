/* function to open a file in a new window opened from the patternlab parent window */
function openInNewWindow (filePath) {
    parent.window.open(filePath, '_blank', 'fullscreen=yes');
    return true;
}
