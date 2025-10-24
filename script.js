document
  .getElementById('file-selector')
  .addEventListener('change', async (e) => {
    const stdTolerance = Number(document.getElementById('std-tolerance').value);
    const maxTolerance = Number(document.getElementById('max-tolerance').value);
    const idColumn =
      Number(document.getElementById('id-column-input').value) - 1;
    const heightColumn =
      Number(document.getElementById('height-column-input').value) - 1;
    const widthColumn =
      Number(document.getElementById('width-column-input').value) - 1;

    const file = e.target.files[0];
    if (!file) return;

    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data, { type: 'array' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];

    // Return array of arrays instead of objects
    const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

    // Skip the header row (row[0])
    const fileData = rows.slice(1).map((row) => ({
      id: row[idColumn],
      soHeight: Number(row[heightColumn]),
      soWidth: Number(row[widthColumn]),
    }));

    const frameGroups = groupFrameSizes(fileData, stdTolerance, maxTolerance);

    const outputContainer = document.getElementById('grouped-frames-output');

    outputContainer.innerHTML = '';

    // create Totals header
    const headerDiv = document.createElement('div');
    headerDiv.innerHTML = `Total Frames: ${rows.length} | Number of sizes: ${frameGroups.length}`;
    headerDiv.style.marginBottom = '1em';
    headerDiv.style.padding = '10px';
    headerDiv.style.border = '1px solid #ccc';
    headerDiv.style.borderRadius = '6px';
    headerDiv.style.background = '#f9f9f9';
    headerDiv.style.width = '370px';
    outputContainer.appendChild(headerDiv);

    frameGroups.forEach((g, i) => {
      const newDiv = document.createElement('div');
      newDiv.style.marginBottom = '1em';
      newDiv.style.padding = '10px';
      newDiv.style.border = '1px solid #ccc';
      newDiv.style.borderRadius = '6px';
      newDiv.style.background = '#f9f9f9';
      newDiv.style.width = '370px';

      let output = '';
      output += `Group ${i + 1}\n`;
      output += `Frame Size: ${g.frameHeight} × ${g.frameWidth}\n`;
      output += `Structural Openings:\n`;

      g.openings.forEach((o) => {
        output += `  - ${o.id} (${o.soHeight} × ${o.soWidth})\n`;
      });

      const pre = document.createElement('pre');
      pre.textContent = output;

      newDiv.appendChild(pre);
      outputContainer.appendChild(newDiv);
    });
  });

function groupFrameSizes(array, stdTolerance, maxTolerance) {
  // Sort the array by soH  eight
  array.sort(function (a, b) {
    if (a.soHeight === b.soHeight) {
      return a.soWidth - b.soWidth; // if soHeight a == soHeight b sort by soWidth
    }
    return a.soHeight - b.soHeight;
  });

  let groups = [];

  // loop though openings array
  for (let o = 0; o < array.length; o++) {
    let added = false;

    if (groups.length === 0) {
      // create new group
      let newGroup = {
        frameHeight: array[o].soHeight - stdTolerance,
        frameWidth: array[o].soWidth - stdTolerance,
        openings: [{ ...array[o] }],
      };

      groups.push(newGroup);
    } else {
      // loop though existing groups
      for (let g = 0; g < groups.length; g++) {
        const group = groups[g];

        // calculate the clearance
        const heightDiff = array[o].soHeight - group.frameHeight;
        const widthDiff = array[o].soWidth - group.frameWidth;

        // check if within tolerance
        if (
          heightDiff >= stdTolerance &&
          heightDiff <= maxTolerance &&
          widthDiff >= stdTolerance &&
          widthDiff <= maxTolerance
        ) {
          // fits this frame, add to this group
          group.openings.push({ ...array[o] });
          added = true;
          break; // stop checking other groups
        }
      }
      // if it didn't fit any group, make a new one
      if (!added) {
        let newGroup = {
          frameHeight: array[o].soHeight - stdTolerance,
          frameWidth: array[o].soWidth - stdTolerance,
          openings: [{ ...array[o] }],
        };
        groups.push(newGroup);
      }
    }
  }

  return groups;
}
