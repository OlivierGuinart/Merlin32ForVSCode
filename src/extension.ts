import * as vscode from 'vscode';
import * as data from '../strings/resources.json';
import * as hover from './hover';

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {

	hover.initializeOpcodesRegex();
	let activeEditor = vscode.window.activeTextEditor;
	if (activeEditor) {
		hover.triggerUpdateDecorations(activeEditor);
	}

	vscode.window.onDidChangeActiveTextEditor(editor => {
		activeEditor = editor;
		if (editor) {
			hover.triggerUpdateDecorations(activeEditor);
		}
	}, null, context.subscriptions);

	vscode.workspace.onDidChangeTextDocument(event => {
		if (activeEditor && event.document === activeEditor.document) {
			hover.triggerUpdateDecorations(activeEditor);
		}
	}, null, context.subscriptions);
}

