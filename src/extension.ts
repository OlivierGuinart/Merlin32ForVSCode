import * as vscode from 'vscode';
import * as hover from './hover';

// this method is called when vs code is activated
export function activate(context: vscode.ExtensionContext) {
	hover.activate(context);
}

