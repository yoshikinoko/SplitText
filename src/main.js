/*
 * SplitText.
 * Yoshiki Takeoka
 */
const { selection, Rectangle, Color, Text } = require('scenegraph');
const commands = require('commands');
const { alert } = require('@adobe/xd-plugin-toolkit/lib/dialogs.js');

async function showAlert() {
  return alert('SplitText', 'Please select text element(s).');
}

async function split(separator) {
  const texts = selection.items.filter(element => element instanceof Text);

  if (texts.length === 0) {
    await showAlert();
    return 1;
  }
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
  return 0;
}

async function splitbynewline() {
  await split('\n');
}
async function splitbytab() {
  await split('\t');
}
async function splitbycomma() {
  await split(',');
}

module.exports = {
  commands: {
    splitbynewline,
    splitbytab,
    splitbycomma,
  },
};
