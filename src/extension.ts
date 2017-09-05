import * as vscode from 'vscode';
import * as data from '../strings/resources.json';

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {

	function initializeOpcodesRegex() {
		let r : string = "\\b(";
		for (var prop in data) {
			if (prop != "--^") {
				r += prop + "|";
			}
		}
		// The last '|(--\\^)' group below is the ELUP synomym,
		// not considered a word per regex standards, so not in \b boundaries group.
		return r.substr(0, r.length - 1) + ")\\b|(--\\^)"; 
	}

	let regEx = new RegExp(initializeOpcodesRegex(), 'gi');

	// create an empty decorator type (no need for border around the opcode nor different background color)
	// this is just to enable hover.
	const opcodesDecorationType = vscode.window.createTextEditorDecorationType({
	});

	let activeEditor = vscode.window.activeTextEditor;
	if (activeEditor) {
		triggerUpdateDecorations();
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations();
		}
	}, null, context.subscriptions);

	var timeout = null;
	function triggerUpdateDecorations() {
		if (timeout) {
			clearTimeout(timeout);
		}
		timeout = setTimeout(updateDecorations, 500);
	}

	function updateDecorations() {
		if (!activeEditor) {
			return;
		}
		const text = activeEditor.document.getText();
		const opcodes: vscode.DecorationOptions[] = [];
		let match;
		while (match = regEx.exec(text)) {
			const startPos = activeEditor.document.positionAt(match.index);
			const endPos = activeEditor.document.positionAt(match.index + match[0].length);
			const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: data[match[0].toUpperCase()] };
			opcodes.push(decoration);
		}
		if (opcodes.length > 0) {
			activeEditor.setDecorations(opcodesDecorationType, opcodes);
		}
	}
}

