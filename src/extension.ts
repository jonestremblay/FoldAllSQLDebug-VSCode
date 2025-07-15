import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand('extension.foldAllDebug', () => {
  	vscode.commands.executeCommand('editor.foldAllMarkerRegions');
  	});
	context.subscriptions.push(disposable);
}

export function deactivate() {}
