// words and syllables

let Words = [
	"I","you (singular)","he","we","you (plural)","they",
	"this","that","here","there","who","what","where","when","how","not",
	"all","many","some","few","other",
	"one","two","three","four","five",
	"big","long","wide","thick","heavy",
	"small","short","narrow","thin",
	"woman","man (adult male)","man (human being)","child",
	"wife","husband","mother","father",
	"animal","fish","bird","dog","louse","snake","worm",
	"tree","forest","stick","fruit","seed","leaf","root","bark","flower","grass",
	"rope","skin","meat","blood","bone","fat","egg","horn","tail","feather","hair",
	"head","ear","eye","nose","mouth","tooth","tongue","fingernail",
	"foot","leg","knee","hand","wing","belly","guts","neck","back","breast",
	"heart","liver",
	"to drink","to eat","to bite","to suck","to spit","to vomit","to blow",
	"to breathe","to laugh","to see","to hear","to know","to think","to smell",
	"to fear","to sleep","to live","to die","to kill","to fight","to hunt",
	"to hit","to cut","to split","to stab","to scratch","to dig",
	"to swim","to fly","to walk","to come","to lie","to sit","to stand",
	"to turn","to fall","to give","to hold","to squeeze","to rub","to wash",
	"to wipe","to pull","to push","to throw","to tie","to sew","to count",
	"to say","to sing","to play","to float","to flow","to freeze","to swell",
	"sun","moon","star","water","rain","river","lake","sea","salt","stone",
	"sand","dust","earth","cloud","fog","sky","wind","snow","ice","smoke",
	"fire","ash","to burn",
	"road","mountain",
	"red","green","yellow","white","black",
	"night","day","year",
	"warm","cold","full","new","old","good","bad","rotten","dirty",
	"straight","round","sharp","dull","smooth","wet","dry","correct",
	"near","far","right","left",
	"at","in","with","and","if","because","name"
];

const syllableDist = [
	{ syllables: 1, weight: 0.8 },
	{ syllables: 2, weight: 0.18 },
	{ syllables: 3, weight: 0.02 }
];

let words = []


// functions


function randomFrom(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}

function getSelectedConsonants() {
	return [...document.querySelectorAll(".ipa-symbol.consonant.selected")].map(e => e.textContent);
}

function getSelectedVowels() {
	return [...document.querySelectorAll(".ipa-symbol.vowel.selected")].map(e => e.textContent);
}

function pickSyllableCount() {
	const r = Math.random();
	let acc = 0;

	for (const option of syllableDist) {
		acc += option.weight;
		if (r <= acc) return option.syllables;
	}
	return 1;
}


// Generation


function generateSyllable(pattern, C, V) {
	let out = "";
	let i = 0;
	
	while (i < pattern.length) {
		if (pattern[i] === "(") {
			const j = pattern.indexOf(")", i);
			if (j === -1) break;
			if (Math.random() < 0.5) {
				i = j + 1;
				continue;
			}
			i++;
		} 
		if (pattern[i] === "C") {
			out += randomFrom(C);
		}
		if (pattern[i] === "V") {
			out += randomFrom(V);
		}
		i++;
	}
	
	return out;
}


function generateUniqueWords(count) {
	const C = getSelectedConsonants();
	const V = getSelectedVowels();

	const pattern = document.getElementById("syllablePattern").value;

	const lexicon = new Set();
	const MAX_SYLLABLES = 5;
	let nowords = 0;

	while (lexicon.size < count) {
		let word = null;
		let targetSyllables = pickSyllableCount();

		for (let syllables = targetSyllables; syllables <= MAX_SYLLABLES; syllables++) {

			let candidate = "";
				for (let i = 0; i < syllables; i++) {
				candidate += generateSyllable(pattern, C, V);
			}

			if (!lexicon.has("/"+candidate+"/")) {
				word = candidate;
				break;
			}
			if (word) break;
		}
		
		if (!word) {
			word = "fail #" + nowords;
			nowords++;
		} else {
			word = "/"+word+"/";
		}
		lexicon.add(word);
		console.log(word);
	}
	
	if (nowords > 0) alert("Phonemic inventory is too small, some fails occured.");

	return [...lexicon];
}


// Show results

function renderTable(words) {
	const container = document.getElementById("results");
	container.innerHTML = "";

	const table = document.createElement("table");
	table.border = "1";
	table.cellPadding = "6";

	const header = document.createElement("tr");
	header.innerHTML = "<th>#</th><th>English</th><th>IPA</th>";
	table.appendChild(header);

	Words.forEach((gloss, i) => {
	const row = document.createElement("tr");
	row.innerHTML = `
		<td>${i + 1}</td>
		<td>${gloss}</td>
		<td>${words[i]}</td>
	`;
	table.appendChild(row);
	});

	container.appendChild(table);
}

function validateSyllableInput() {
    const vowelsSelected = document.querySelectorAll('.ipa-symbol.vowel.selected').length > 0;
    const consonantsSelected = document.querySelectorAll('.ipa-symbol.consonant.selected').length > 0;

    if (!vowelsSelected) {
        alert("Please select at least one vowel.");
        return false;
    }

    const patternInput = document.getElementById('syllablePattern').value.toUpperCase();

    if (!patternInput.includes('V')) {
        alert("The syllable pattern must contain at least one 'V'.");
        return false;
    }

    if (!consonantsSelected && patternInput.includes('C')) {
        alert("Please select at least one consonant since the pattern contains 'C'.");
        return false;
    }

    return true;
}

// Events

document.querySelectorAll(".ipa-symbol").forEach(el => {
	el.addEventListener("click", () => {
		el.classList.toggle("selected");
	});
});


document.getElementById("generateButton").addEventListener("click", () => {
	if (validateSyllableInput()) {
		words = generateUniqueWords(Words.length);
		renderTable(words);
	}
});


// Save and load

function saveWords() {
    const selectedSounds = Array.from(document.querySelectorAll('.ipa-symbol.selected'))
        .map(el => el.textContent);

    const wordDict = {};
    Words.forEach((english, i) => {
        wordDict[english] = words[i] || "";
    });

    const dataToSave = {
        wordDict: wordDict,
        selectedSounds: selectedSounds
    };

    const jsonStr = JSON.stringify(dataToSave, null, 2);

    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'words.json';
    a.click();

    URL.revokeObjectURL(url);
}

function loadWords(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);

            // Restore
            document.querySelectorAll('.ipa-symbol.selected').forEach(el => el.classList.remove('selected'));
            data.selectedSounds.forEach(text => {
                const el = Array.from(document.querySelectorAll('.ipa-symbol'))
                    .find(span => span.textContent === text);
                if (el) el.classList.add('selected');
            });
            Words = Object.keys(data.wordDict);
            words = Object.values(data.wordDict);

            renderTable(words);

        } catch (err) {
            alert('Failed to load JSON: ' + err.message);
        }
    };
    reader.readAsText(file);
}

// More events
document.getElementById('save').addEventListener('click', saveWords);
document.getElementById('loadInput').addEventListener('change', loadWords);


let tableMinimized = false;

function toggleMinimizeTable() {
    const tables = document.querySelectorAll('.sound-table');
	
	tables.forEach(table => {

		const rows = Array.from(table.rows);
		const headerRow = rows[0];

		for (let colIndex = 1; colIndex < headerRow.cells.length; colIndex++) {
			let hasSelected = false;

			for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
				const cell = rows[rowIndex].cells[colIndex];
				if (!cell) continue;

				if (cell.querySelector('.ipa-symbol.selected')) {
					hasSelected = true;
					break;
				}
			}

			rows.forEach(row => {
				const cell = row.cells[colIndex];
				if (!cell) return;

				if (tableMinimized) {
					cell.classList.remove("hidden");
				} else if (!hasSelected) {
					cell.classList.add("hidden");
				}
			});
		}

		
		for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
			const row = rows[rowIndex];
			const hasSelected = row.querySelector('.ipa-symbol.selected');

			if (tableMinimized) {
				
				row.classList.remove("hidden");
			} else if (!hasSelected) {
				
				row.classList.add("hidden");
			}
		}
	});
	
	if (tableMinimized) {
		document.getElementById("minimizeButton").innerHTML  = "Minimize tables";
	} else {
		document.getElementById("minimizeButton").innerHTML  = "Maximize tables";
	}

    tableMinimized = !tableMinimized;
}
document.getElementById("minimizeButton").addEventListener("click", toggleMinimizeTable);
