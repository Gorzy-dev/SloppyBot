
async function loadButtons(client) {
    const fs = require('fs').promises;
  
    const buttonsFolder = await fs.readdir('./Buttons');
  
    for (const folder of buttonsFolder) {
      const buttonFiles = await fs.readdir(`./Buttons/${folder}`);
      const jsFiles = buttonFiles.filter((file) => file.endsWith('.js'));
  
      for (const file of jsFiles) {
        const button = await import(`../Buttons/${folder}/${file}`);
        if (!button.id) continue;
  
        client.buttons.set(button.id, button);
      }
    }
  
    console.log(('[SUCCESS]') + ' Buttons Loaded');
  }
  
module.exports = { loadButtons }