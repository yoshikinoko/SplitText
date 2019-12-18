/*
 * SplitText.
 * Yoshiki Takeoka
 */
const { selection, Text } = require('scenegraph');
const commands = require('commands');
const { alert } = require('@adobe/xd-plugin-toolkit/lib/dialogs.js');

async function showAlert() {
  return alert('SplitText', 'Please select text element(s).');
}

async function split(param) {
  const texts = selection.items.filter(element => element instanceof Text);

  if (texts.length === 0) {
    await showAlert();
    return 1;
  }
  texts.forEach(text => {
    const lines = text.text.split(param.separator);
    const lineGroup = [];
    lines.forEach(line => {
      if (line !== '') {
        selection.items = text;
        commands.duplicate();
        // the duplicated item is in the selection.
        const duplicated = selection.items[0];
        duplicated.text = line;
        duplicated.name = line;
        duplicated.areaBox = null;
        lineGroup.push(duplicated);
      }
    });
    if (lineGroup.length > 0) {
      const lastLine = lineGroup[lineGroup.length - 1];
      selection.items = [text, lastLine];
      switch (param.distribution) {
        case 'vertical':
          commands.alignBottom();
          selection.items = lineGroup;
          commands.distributeVertical();
          break;
        case 'horizontal':
          commands.alignRight();
          selection.items = lineGroup;
          commands.distributeHorizontal();
          break;
        default:
          break;
      }
      commands.group();
      selection.items[0].name = text.text;
      // Hide original text not to overlap split text
      text.visible = false;
    }
  });
  return 0;
}

async function splitbynewline() {
  await split({ separator: '\n', distribution: 'vertical' });
}
async function splitbytab() {
  await split({ separator: '\t', distribution: 'horizontal' });
}
async function splitbycomma() {
  await split({ separator: ',', distribution: 'horizontal' });
}

module.exports = {
  commands: {
    splitbynewline,
    splitbytab,
    splitbycomma,
  },
};
