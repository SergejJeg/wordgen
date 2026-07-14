# Word Generator

A small browser-based tool for generating random words from a set of phonetic rules. You can choose which consonants and vowels are available, define a syllable pattern, generate as many words as you need, and save the results to a JSON file for later.

## What it does

* Choose which consonants to use.
* Choose which vowels to use.
* Define the syllable structure. Structure requires at least one vowel, supports consonants and parenthesies, e.g. `CV(C)`.
* Generate a list of random words.
* Save generated words and settings as a JSON file.
* Load a previously saved JSON file.

## How to use

Download `main.html`, `style.css` and `script.js` into the same folder and open `main.html` in your browser.

1. Select the consonants and vowels you want to use.
2. Enter the syllable structure.
3. Generate a list of words.
4. Save the results if you want to keep them, or load a previous JSON file to continue where you left off.

## Example

Configuration:

* Consonants: `m n p b t d k g s z ʃ ʒ f v θ ð x h ɹ j r l`
* Vowels: `i u ɪ ʊ e o ə ɛ ʌ ɔ a ɑ`
* Structure: `CV(V)(C)`

Possible output:

```text
#	English	IPA
1	I	/biðoθ/
2	you (singular)	/gʌið/
3	he	/pʌə/
4	we	/raa/
5	you (plural)	/zɑʊhuə/
6	they	/ðoɛ/
...
207	name	/ʃɪaxvə/
```

Because the words are generated randomly, you'll get different results each time.

## Files

```text
main.html    Main application
style.css     Styling
script.js     Word generation logic
README.md
```

## License

Feel free to use or modify this project however you'd like.
