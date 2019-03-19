/*
 * Split Text by a new line.
 * Yoshiki Takeoka
 */

const { selection, Rectangle, Color, Text } = require('scenegraph');
const commands = require('commands');

function split(separator) {
  const texts = selection.items.filter(element => element instanceof Text);
  texts.forEach(text => {
    const lines = text.text.split(separator);
    const lineGroup = [];
    lines.forEach(line => {
      if (line !== '') {
        selection.items = text;
        commands.duplicate();
        // the duplicated item is in the selection.
        const duplicated = selection.items[0];
        duplicated.text = line;
        duplicated.name = line;
        lineGroup.push(duplicated);
      }
    });
    if (lineGroup.length > 0) {
      const lastLine = lineGroup[lineGroup.length - 1];
      selection.items = [text, lastLine];
      commands.alignBottom();
      selection.items = lineGroup;
      commands.distributeVertical();
      commands.group();
    }
  });
}

function splitbynewline() {
  split('\n');
}
function splitbytab() {
  split('\t');
}
function splitbycomma() {
  split(',');
}

module.exports = {
  commands: {
    splitbynewline,
    splitbytab,
    splitbycomma,
  },
};
