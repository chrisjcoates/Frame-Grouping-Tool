document
  .getElementById('file-selector')
  .addEventListener('change', async (e) => {
    const stdTolerance = Number(document.getElementById('std-tolerance').value);
    const maxTolerance = Number(document.getElementById('max-tolerance').value);

    // Get the column indexes from html page
    const ratingColumn = Number(
      document.getElementById('rating-column-input').value - 1
    );
    const typeColumn = Number(
      document.getElementById('type-column-input').value - 1
    );
    const idColumn = Number(
      document.getElementById('id-column-input').value - 1
    );
    const heightColumn = Number(
      document.getElementById('height-column-input').value - 1
    );
    const widthColumn = Number(
      document.getElementById('width-column-input').value - 1
    );
    const depthColumn = Number(
      document.getElementById('depth-column-input').value - 1
    );
    const vpColumn = Number(
      document.getElementById('vp-column-input').value - 1
    );
    const lockColumn = Number(
      document.getElementById('lock-column-input').value - 1
    );

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
      type: row[typeColumn],
      fire_Rating: row[ratingColumn],
      so_Height: Number(row[heightColumn]),
      so_Width: Number(row[widthColumn]),
      wall_Depth: Number(row[depthColumn]),
      vp_column: row[vpColumn],
      lock_column: row[lockColumn],
    }));

    console.log(fileData);

    // group all the structural opening sizes to frame sizes
    const frameGroups = groupFrameSizes(fileData, stdTolerance, maxTolerance);

    // Get the container for the output
    const outputContainer = document.getElementById('grouped-frames-output');
    const headerContainer = document.getElementById('header-container');

    outputContainer.innerHTML = '';

    // create Totals header
    const headerDiv = document.createElement('div');
    headerDiv.innerHTML = `Total Door Sets: ${fileData.length} | Number of frame sizes: ${frameGroups.length}`;
    headerDiv.style.marginBottom = '1em';
    headerDiv.style.padding = '10px';
    headerDiv.style.border = '1px solid #ccc';
    headerDiv.style.borderRadius = '6px';
    headerDiv.style.background = '#f9f9f9';
    headerDiv.style.width = '370px';

    // Clear inner html
    headerContainer.innerHTML = '';
    // add the header to the container
    headerContainer.appendChild(headerDiv);

    // Update the original array to include groups frames sizes
    let updatedArray = updateOriginalArray(fileData, frameGroups);
    // Add a table tot hte html page to display the updated array data
    //createTable(updatedArray, 'table-container');

    const groupTitle = document.createElement('h2');
    groupTitle.style.marginTop = '1em';
    groupTitle.style.marginBottom = '2px';
    groupTitle.style.paddingLeft = '10px';

    groupTitle.textContent = 'Grouped Summary';

    outputContainer.append(groupTitle);

    // loop through frame groups and create elements for each group
    frameGroups.forEach((g, i) => {
      const newDiv = document.createElement('div');
      newDiv.style.marginTop = '1em';
      newDiv.style.marginBottom = '1em';
      newDiv.style.padding = '10px';
      newDiv.style.border = '1px solid #ccc';
      newDiv.style.borderRadius = '6px';
      newDiv.style.background = '#f9f9f9';
      newDiv.style.width = '700px';

      // Set the text output for each group
      let output = '';
      output += `Group ${i + 1}\n`;
      output += `Fire Rating: ${g.fire_Rating}\n`;
      output += `Frame Size: ${g.frame_Height} × ${g.frame_Width} x ${g.wall_Depth} - ${g.openings.length} No.\n`;
      output += `Details:\n`;

      // create new element
      const pre = document.createElement('pre');
      pre.textContent = output;

      // create table container
      const tableContainer = document.createElement('div');
      tableContainer.style.marginTop = '0.5em';

      // append both to the group div
      newDiv.appendChild(pre);
      newDiv.appendChild(tableContainer);

      // append the group div to output
      outputContainer.appendChild(newDiv);

      // finally create the table inside that container
      createTable(g.openings, tableContainer);
    });
  });

function updateOriginalArray(originalArray, groupedArray) {
  let newArray = originalArray;

  console.log('Running updateOrininalArray Function...');
  // Loop through origional array
  for (let a = 0; a < newArray.length; a++) {
    // loops through groups
    for (let g = 0; g < groupedArray.length; g++) {
      // loop though each group array
      for (let item = 0; item < groupedArray[g]['openings'].length; item++) {
        // check for matching Ids
        if (groupedArray[g]['openings'][item]['id'] === newArray[a]['id']) {
          newArray[a]['frameWidth'] = groupedArray[g]['frameWidth'];
          newArray[a]['frameHeight'] = groupedArray[g]['frameHeight'];
          newArray[a]['frameDepth'] = groupedArray[g]['wallDepth'];
        }
      }
    }
  }
  return newArray;
}

function createTable(data, container) {
  if (!data || data.length === 0) {
    container.innerHTML = '';
    return;
  }

  const columns = Object.keys(data[0]);
  let table = "<table border='1' cellspacing='0' cellpadding='5'>";
  table += '<thead><tr>';
  columns.forEach(
    (col) => (table += `<th>${col.replace('_', ' ').toUpperCase()}</th>`)
  );
  table += '</tr></thead><tbody>';

  data.forEach((row) => {
    table += '<tr>';
    columns.forEach((col) => (table += `<td>${row[col]}</td>`));
    table += '</tr>';
  });

  table += '</tbody></table>';
  container.innerHTML = table;
}

function groupFrameSizes(array, stdTolerance, maxTolerance) {
  // clone the array to keep the origional intact
  const clonedArray = array;
  // Sort the array by soH eight
  clonedArray.sort(function (a, b) {
    if (a.so_Height === b.so_Height) {
      return a.so_Width - b.so_Width; // if soHeight a == soHeight b sort by soWidth
    }
    return a.so_Height - b.so_Height;
  });

  let groups = [];

  // loop though openings array
  for (let o = 0; o < clonedArray.length; o++) {
    let added = false;

    if (groups.length === 0) {
      // if arrays empty create new group
      let newGroup = {
        fire_Rating: clonedArray[o].fire_Rating,
        frame_Height: clonedArray[o].so_Height - stdTolerance,
        frame_Width: clonedArray[o].so_Width - stdTolerance,
        wall_Depth: clonedArray[o].wall_Depth,
        openings: [{ ...clonedArray[o] }],
      };

      groups.push(newGroup);
    } else {
      // loop though existing groups
      for (let g = 0; g < groups.length; g++) {
        const group = groups[g];

        // calculate the clearance
        const heightDiff = clonedArray[o].so_Height - group.frame_Height;
        const widthDiff = clonedArray[o].so_Width - group.frame_Width;

        // check if within tolerance
        if (
          heightDiff >= stdTolerance &&
          heightDiff <= maxTolerance &&
          widthDiff >= stdTolerance &&
          widthDiff <= maxTolerance
        ) {
          // Check if the wall depths match
          if (clonedArray[o].fire_Rating === group.fire_Rating) {
            // if it does, check fire rating
            if (clonedArray[o].wall_Depth === group.wall_Depth) {
              group.openings.push({ ...clonedArray[o] });
              added = true;
              break; // stop checking other groups
            } else {
              group.openings.push({ ...clonedArray[o] });
              added = true;
              break; // stop checking other groups
            }
          }
        }
      }
      // if it didn't fit any group, make a new one
      if (!added) {
        let newGroup = {
          fire_Rating: clonedArray[o].fire_Rating,
          frame_Height: clonedArray[o].so_Height - stdTolerance,
          frame_Width: clonedArray[o].so_Width - stdTolerance,
          wall_Depth: clonedArray[o].wall_Depth,
          openings: [{ ...clonedArray[o] }],
        };
        groups.push(newGroup);
      }
    }
  }

  return groups;
}
