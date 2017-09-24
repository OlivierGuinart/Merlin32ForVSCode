import * as vscode from 'vscode';
import * as data from '../strings/resources.json';

// create an empty decorator type (no need for border around the opcode nor different background color)
// this is just to enable hover.
const opcodesDecorationType = vscode.window.createTextEditorDecorationType({ });

export function activate(context: vscode.ExtensionContext)
{
    initializeOpcodesRegex();
	let activeEditor = vscode.window.activeTextEditor;
	if (activeEditor) {
		triggerUpdateDecorations(activeEditor);
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			triggerUpdateDecorations(activeEditor);
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			triggerUpdateDecorations(activeEditor);
		}
	}, null, context.subscriptions);
}

var _regExp: RegExp;
function initializeOpcodesRegex() {
    let r : string = "\\b(";
    for (var prop in data) {
        if (prop != "--^") {
            r += prop + "|";
        }
    }
    // The last '|(--\\^)' group below is the ELUP synomym,
    // not considered a word per regex standards, so not in \b boundaries group.
    _regExp = new RegExp(r.substr(0, r.length - 1) + ")\\b|(--\\^)", 'gi'); 
}

let _activeEditor: vscode.TextEditor;
var _timeout = null;
function triggerUpdateDecorations(activeEditor: vscode.TextEditor) : NodeJS.Timer {
    _activeEditor = activeEditor;
    if (_timeout) {
        clearTimeout(_timeout);
    }
    _timeout = setTimeout(updateDecorations, 500);
    return _timeout;
}

function updateDecorations() {
    if (!_activeEditor) {
        return;
    }
    const text = _activeEditor.document.getText();
    const opcodes: vscode.DecorationOptions[] = [];
    let match;
    while (match = _regExp.exec(text)) {
        const startPos = _activeEditor.document.positionAt(match.index);
        const endPos = _activeEditor.document.positionAt(match.index + match[0].length);
        const decoration = { range: new vscode.Range(startPos, endPos), hoverMessage: data[match[0].toUpperCase()] };
        opcodes.push(decoration);
    }
    if (opcodes.length > 0) {
        _activeEditor.setDecorations(opcodesDecorationType, opcodes);
    }
}
