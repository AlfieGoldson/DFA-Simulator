import { readFileStr } from 'https://deno.land/std/fs/read_file_str.ts';

const text = await readFileStr('automate');
const lines = text.split('\n');

interface Automate {
	alphabet: string[];
	state: number;
	accepting_states: number[];
	matrix: string[][][];
}

let automate: Automate = {
	alphabet: [],
	state: -1,
	accepting_states: [],
	matrix: [],
};

lines.forEach((l, i) => {
	if (i > 7) return;
	switch (i) {
		case 0:
			automate.alphabet = l.split('');
			break;
		case 1:
			automate.state = parseInt(l);
			break;
		case 2:
			automate.accepting_states = l.split('').map(parseInt);
			break;
		default:
			const transitions = l.split(';');
			automate.matrix.push(transitions.map((t) => t.split('')));
			break;
	}
});

function testWord(auto: Automate, w: string[]): boolean {
	if (w.length === 0) return auto.accepting_states.includes(auto.state);
	if (!auto.alphabet.includes(w[0])) return false;

	let include = false;
	let newState = -1;
	auto.matrix[auto.state].forEach((t, i) => {
		if (t.includes(w[0])) {
			include = true;
			newState = i;
		}
	});

	if (!include) return false;

	return testWord(
		{ ...auto, state: newState },
		w.filter((l, i) => i > 0)
	);
}

['aaba', 'aa', 'a', 'aba'].forEach((w) => {
	console.log(w, '=>', testWord(automate, w.split('')));
});
